<template>
  <div class="turn-irri">
    <el-scrollbar class="scroolbar" :native="false">
      <el-collapse accordion style="backgroud: transparent">
        <div v-for="info in TurnInfo" :key="info.id">
          <el-collapse-item>
            <span style="color: white">{{ info.id }} 号农事记录</span>
            <p style="color: white">
              {{
                `${dateFormat(info.startTime)} -> ${dateFormat(info.endTime)}`
              }}
            </p>
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
                :title="`${dateFormat(info.startTime)} -> ${dateFormat(
                  info.endTime
                )}`"
                :color="getTotalStatus(info.id)"
                :sub-title="`结束时间:${dateFormat(info.endTime)}`"
                :percentage="getTotalPercentage(info.id)"
              ></s-progress>
            </template>
            <div v-for="group in info.group" :key="group.id">
              <s-progress
                :title="group.group.name"
                :color="getStatus(info.id, group.id)"
                :percentage="getPercentage(info.id, group.id)"
              ></s-progress>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </el-scrollbar>
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
  private TurnState: TurnStateInterface[] = [];

  private customColors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#6f7ad3', percentage: 40 },
    { color: '#e6a23c', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#5cb87a', percentage: 100 }
  ];

  private getTotalPercentage (id: number): number {
    if (this.TurnState.length) {
      const state = this.TurnState.find(
        (state: TurnStateInterface) => state.id === id
      )
      if (state) {
        if (state.state !== TurnStateEnum.failure) {
          return state.process * 100
        } else return 100
      }
    }
    return 0
  }

  private getTotalStatus (id: number) {
    if (this.TurnState.length) {
      const state = this.TurnState.find(
        (state: TurnStateInterface) => state.id === id
      )
      if (state) {
        if (state.state === TurnStateEnum.failure) return '#f56c6c'
      }
    }
    return this.customColors
  }

  private getPercentage (infoId: number, groupId: number): number {
    if (this.TurnState.length) {
      const state = this.TurnState.find(
        (state: TurnStateInterface) => state.id === infoId
      )
      if (state) {
        const content = state.contentStates.find(
          (item: TurnContentStateInterface) => item.id === groupId
        )
        if (content) {
          if (content.state !== TurnStateEnum.failure) {
            return content.process * 100
          } else return 100
        }
      }
    }
    return 0
  }

  private getStatus (infoId: number, groupId: number) {
    if (this.TurnState.length) {
      const state = this.TurnState.find(
        (state: TurnStateInterface) => state.id === infoId
      )
      if (state) {
        const content = state.contentStates.find(
          (item: TurnContentStateInterface) => item.id === groupId
        )
        if (content) {
          console.log(content.state)
          if (content.state === TurnStateEnum.failure) {
            return '#f56c6c'
          }
        }
      }
    }
    return this.customColors
  }

  private dateFormat (value: any, format: string) {
    return moment(value).format(format || 'YYYY-MM-DD HH:mm')
  }

  private mounted () {
    Bus.onTurnIrrigationState((state: TurnStateInterface[]) => {
      this.TurnState = state
      console.log(this.TurnState, state)
    })
  }
}
</script>

<style lang="scss">
.turn-irri {
  width: 90%;
  height: 90%;
  margin: 0 auto;
  .scroolbar {
    height: 100%;
    .el-collapse {
      border: none !important;
    }
    .el-collapse-item__header {
      background: transparent !important;
      padding-right: 0.1rem;
      border: none !important;
      > i {
        display: none;
      }
    }
    .el-collapse-item__wrap {
      padding-right: 0.1rem;
      background: transparent !important;
      border: none !important;
    }
  }
}
</style>

<style lang="scss">
.turn-irri {
  .scroolbar {
    .el-scrollbar__wrap {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }
  }
}
</style>
