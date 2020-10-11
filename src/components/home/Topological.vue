<template>
  <div class="topologicals">
    <s-pipe-pic :relay="getMachineRelay"></s-pipe-pic>
    <s-element></s-element>
    <s-status
      :relay="getMachineRelay"
      :real="getMachineSensor"
      :info="getMachineInfo"
    ></s-status>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import sPipePic from './topological/PipePic.vue'
import sElement from './topological/Element.vue'
import sStatus from './topological/Status.vue'

import { namespace } from 'vuex-class'
import {
  RealValueInterface,
  DisplayRealInterface
} from '../../utils/types/type'
import { lodash, LodashKeys } from '@/utils/lodash'
const otherModule = namespace('other')

@Component({
  components: {
    sPipePic,
    sElement,
    sStatus
  }
})
export default class Topological extends Vue {
  @otherModule.State('DisplayReals') reals!: DisplayRealInterface[];
  private machineInfo = lodash.get(LodashKeys.MachineInfo) || {
    facId: 15112502,
    poolLevel: 1000,
    poolArea: 40000, // 蓄水池  横截面积 单位 平方毫米
    fer1Level: 500,
    fer1Area: 10000, // 肥料桶1  横截面积
    fer2Level: 500,
    fer2Area: 10000, // 肥料桶2  横截面积
    fer3Level: 500,
    fer3Area: 10000, // 肥料桶3  横截面积
    fer4Level: 500,
    fer4Area: 10000 // 肥料桶4  横截面积
  };

  private getRealValue (value: RealValueInterface[], index: number) {
    const result = value.find(
      (data: RealValueInterface) => data.index === index
    )
    if (result) {
      if (typeof result.value === 'string') return parseFloat(result.value)
      return result.value
    }
    return 0
  }

  private get getMachineSensor () {
    const real = {
      power: 1, // 电表
      // water: 2, //水表
      freq: 3, // 变频柜频率
      mainPress: 4, // 主管道压力
      fer1Level: 5, // 肥料桶1液位
      fer1Flow: 6, // 肥料桶1累计流量
      fer2Level: 7, // 肥料桶2液位
      fer2Flow: 8, // 肥料桶2累计流量
      fer3Level: 9, // 肥料桶3液位
      fer3Flow: 10, // 肥料桶3累计流量
      fer4Level: 11, // 肥料桶4液位
      fer4Flow: 12, // 肥料桶4累计流量
      poolLevel: 13, // 水池液位
      poolFlow: 14, // 水池累计流量

      machinePress: 15, // 水肥机压力
      machineEC: 16, // 水肥机电导
      machinePH: 17, // 水肥机PH
      machineFlow: 18 // 水肥机累计流量
    }
    if (!!this.reals && this.reals.length) {
      const machine = this.reals.find(
        (value: DisplayRealInterface) => value.id === this.machineInfo.facId
      )
      // console.log(this.reals, machine);
      if (machine) {
        // real.mainPress = machine.sensor[]
        real.machinePress = this.getRealValue(machine.sensor, 0)
        real.machineEC = this.getRealValue(machine.sensor, 2)
        real.machinePH = this.getRealValue(machine.sensor, 1)
        real.machineFlow = this.getRealValue(machine.sensor, 4)
        real.fer1Level = this.getRealValue(machine.sensor, 5)
        real.fer1Flow = this.getRealValue(machine.sensor, 7)
        real.fer2Level = this.getRealValue(machine.sensor, 8)
        real.fer2Flow = this.getRealValue(machine.sensor, 10)
        real.fer3Level = this.getRealValue(machine.sensor, 11)
        real.fer3Flow = this.getRealValue(machine.sensor, 13)
        real.fer4Level = this.getRealValue(machine.sensor, 14)
        real.fer4Flow = this.getRealValue(machine.sensor, 16)
        real.poolLevel = this.getRealValue(machine.sensor, 17)
        real.poolFlow = this.getRealValue(machine.sensor, 19)
      }
    }
    return real
  }

  private get getMachineInfo () {
    return {
      poolTotalLevel: this.machineInfo.poolLevel, // 单位米
      fer1Height: this.machineInfo.fer1Level,
      fer2Height: this.machineInfo.fer2Level,
      fer3Height: this.machineInfo.fer3Level,
      fer4Height: this.machineInfo.fer4Level
    }
  }

  private get getMachineRelay () {
    const relay = {
      mainPump: 0, // 主水泵状态
      MachinePump: 0, // 施肥泵状态
      fer1InValue: 0, // 肥料桶1进水阀状态
      fer1OutValue: 0, // 肥料桶1出水阀状态
      fer2InValue: 0, // 肥料桶2进水阀状态
      fer2OutValue: 0, // 肥料桶2出水阀状态
      fer3InValue: 0,
      fer3OutValue: 0,
      fer4InValue: 0,
      fer4OutValue: 0
    }
    if (!!this.reals && this.reals.length) {
      const machine = this.reals.find(
        (value: DisplayRealInterface) => value.id === this.machineInfo.facId
      )
      // console.log(this.reals, machine);
      if (machine) {
        relay.mainPump = this.getRealValue(machine.relay, 15)
        relay.MachinePump = this.getRealValue(machine.relay, 4)
        relay.fer1InValue = this.getRealValue(machine.relay, 5)
        relay.fer1OutValue = this.getRealValue(machine.relay, 0)
        relay.fer2InValue = this.getRealValue(machine.relay, 6)
        relay.fer2OutValue = this.getRealValue(machine.relay, 1)
        relay.fer3InValue = this.getRealValue(machine.relay, 7)
        relay.fer3OutValue = this.getRealValue(machine.relay, 2)
        relay.fer4InValue = this.getRealValue(machine.relay, 8)
        relay.fer4OutValue = this.getRealValue(machine.relay, 3)
      }
    }
    return relay
  }
}
</script>

<style lang="scss" scoped>
.topologicals {
  min-width: 7.6rem;
  min-height: calc(100% - 0.4rem);
  // background: url("/image/topological/图_画板 1.png") 100% 100%;
  // background-size: cover;
  position: relative;
}
</style>
