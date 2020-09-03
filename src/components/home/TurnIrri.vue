<template>
  <div class="turn-irri">
    <!-- {{ TurnState }} -->
    <el-collapse accordion style=" backgroud:transparent">
      <div v-for="info in TurnInfo" :key="info.id">
        <el-collapse-item>
          <span style="color:white">{{ info.id }} 号农事记录</span>
          <template slot="title">
            <!-- <span>{{ info.startTime | dateFormat }}{{info.startTime | dateFormat}}</span> -->
            <!-- <el-progress
              style="width:100%;"
              :text-inside="true"
              :stroke-width="22"
              :percentage="getTotalPercentage(info.id)"
              :color="customColors"
            ></el-progress> -->
            <s-progress
              :title="
                `开始时间:${dateFormat(info.startTime)} 结束时间:${dateFormat(
                  info.endTime
                )}`
              "
              :color="getTotalStatus(info.id)"
              :sub-title="`结束时间:${dateFormat(info.endTime)}`"
              :percentage="getTotalPercentage(info.id)"
            ></s-progress>
          </template>
          <div v-for="group in info.group" :key="group.id">
            <s-progress
              :title="group.group.name"
              :color="getStatus(info.id)"
              :percentage="getPercentage(group.id)"
            ></s-progress>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import moment from 'moment'

import * as Bus from '../../utils/bus'
import {
  TurnStateInterface,
  TurnContentStateInterface,
  TurnRecordInterface,
  TurnStateEnum
} from '../../utils/types/type'

import sProgress from './TurnIrri/Progress.vue'
import { Collapse, CollapseItem } from 'element-ui'
const otherModule = namespace('other')
Vue.use(Collapse)
Vue.use(CollapseItem)

@Component({
  components: {
    sProgress
  }
})
export default class TurnIrri extends Vue {
  @otherModule.State('TurnInfo') TurnInfo!: TurnRecordInterface[];
  private TurnState: TurnStateInterface = null;

  private customColors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#6f7ad3', percentage: 40 },
    { color: '#e6a23c', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#5cb87a', percentage: 100 }
  ];

  private getTotalPercentage (id: number): number {
    if (this.TurnState) {
      if (this.TurnState.id === id) {
        if (this.TurnState.state !== TurnStateEnum.failure) { return this.TurnState.process * 100 } else return 100
      }
    }
    return 0
  }

  private getTotalStatus (id: number) {
    if (this.TurnState) {
      if (this.TurnState.id === id) {
        if (this.TurnState.state === TurnStateEnum.failure) return '#f56c6c'
      }
    }
    return this.customColors
  }

  private getPercentage (id: number): number {
    if (this.TurnState) {
      const content = this.TurnState.contentStates.find(
        (item: TurnContentStateInterface) => item.id === id
      )
      if (content) {
        if (content.state !== TurnStateEnum.failure) { return content.process * 100 } else return 100
      }
    }
    return 0
  }

  private getStatus (id: number) {
    if (this.TurnState) {
      const content = this.TurnState.contentStates.find(
        (item: TurnContentStateInterface) => item.id === id
      )
      if (content) {
        console.log(content.state)
        if (content.state === TurnStateEnum.failure) {
          return '#f56c6c'
        }
      }
    }
    return this.customColors
  }

  private dateFormat (value: any, format: string) {
    return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
  }

  private mounted () {
    Bus.onTurnIrrigationState((state: TurnStateInterface) => {
      this.TurnState = state
    })
  }
}
</script>

<style lang="scss">
.turn-irri {
  width: 90%;
  margin: 0 auto;
  .el-collapse {
    border: none !important;
  }
  .el-collapse-item__header {
    background: transparent !important;
    border: none !important;
  }
  .el-collapse-item__wrap {
    background: transparent !important;
    border: none !important;
  }
}
</style>
