<template>
  <div class="map" ref="map" v-if="showMapView">
    <img :width="width" :height="height" :src="src" />
  </div>
  <div class="device" v-else>
    <el-tabs tab-position="left">
      <el-tab-pane v-for="(real, index) in reals" :key="real.id">
        <h4 :title="`${real.name} ${real.id}`" slot="label">
          {{ real.name }} {{ real.id }}
        </h4>
        <el-scrollbar
          class="scroolbar"
          :wrapStyle="{ 'margin-bottom': 0 }"
          :native="false"
        >
          <div class="data" v-if="!!real.sensor && real.sensor.length !== 0">
            <el-row type="flex" class="font-16 flex-warp">
              <el-col
                :span="8"
                v-for="sensor in real.sensor"
                :key="sensor.index"
              >
                <el-card class="card" shadow="hover">
                  <span>
                    {{ sensor.name }} :
                    <em>{{ sensor.value }}{{ sensor.unit }}</em>
                  </span>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div
            v-if="!!real.relay && real.relay.length !== 0"
            v-loading="isOption[index]"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-row type="flex" class="font-16 flex-warp">
              <el-col
                class="valve"
                :span="4"
                v-for="relay in real.relay"
                :key="relay.index"
              >
                <span>{{ relay.name }}</span>
                <el-switch
                  :value="relay.value === 1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="onSwitchChange(real.id, relay, index)"
                ></el-switch>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { Element, Reals, Relay } from '@/app/main/database/model'
import {
  DeviceInterface,
  ChannelInfoInterface,
  RelayInfoInterface,
  RealApiInterface,
  RealValueInterface,
  DisplayRealInterface,
  ResponedInterface
} from '@/utils/types/type'
import * as Bus from '@/utils/bus'

import { Switch, Card, Tabs, TabPane, Message, Loading } from 'element-ui'
const databaseModule = namespace('database')
const otherModule = namespace('other')
Vue.use(Switch)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Loading)

@Component
export default class MapView extends Vue {
  @databaseModule.Action('saveReals') saveReals!: (param: any[]) => void;
  @otherModule.State('DisplayReals') reals!: DisplayRealInterface[];

  @Ref() private readonly map!: HTMLDivElement;
  private showMapView = false;
  private width = 280;
  private height = 140;
  private src = '';
  private isOption: boolean[] = [];

  private get getReals () {
    this.isOption = this.reals.map((real: any) => false)
    // console.log(this.reals);
    return this.reals
  }

  private async onSwitchChange (
    id: number,
    relay: RealValueInterface,
    index: number
  ) {
    this.$set(this.isOption, index, true)
    console.log(this.isOption)
    const result = await Bus.setRelay(
      id,
      relay.index,
      relay.value === 1 ? 0 : 1
    )
    this.$set(this.isOption, index, false)
    console.log(this.isOption)
    if (result.state === 0) {
      // relay.value = result.data.state;
      Bus.getReals().then((res: ResponedInterface) => {
        if (res.state === 0) {
          console.log(res.data)
          this.saveReals(res.data)
        } else {
          Message.warning(res.type + '-' + res.msg)
        }
      })

      Message.success('操作成功')
    } else {
      Message.error(result.msg)
    }
  }

  private mounted () {
    if (this.showMapView) {
      // console.log(this.map.clientHeight, this.map.clientWidth);
      this.width = this.map.clientWidth - 5
      this.height = this.map.clientHeight - 5
      this.src = `http://api.map.baidu.com/staticimage/v2?ak=d0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5&width=${this.width}&height=${this.height}&zoom=11&copyright=2&dpiType=pl`
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.device {
  .el-tabs__item {
    padding: 0 10px;
    color: white;
  }
  .is-active {
    color: #409eff;
  }
  h4 {
    text-align: left;
    width: 1.3rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .scroolbar {
    height: 6.6rem;
    .el-scrollbar__wrap {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }

    .flex-warp {
      flex-wrap: wrap;

      .card {
        height: 0.8rem;
        text-align: center;
        margin-bottom: 0.05rem;
        margin-right: 0.05rem;
      }

      .valve {
        text-align: center;
        margin-bottom: 0.05rem;
      }
    }
  }
}
</style>
