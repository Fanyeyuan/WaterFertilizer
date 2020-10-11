<template>
  <div class="status">
    <el-image
      class="pump"
      :class="{ mainPumpFilter: relay.mainPump }"
      src="/image/topological/水泵.png"
    ></el-image>
    <div class="mainPump">
      <s-list
        title="压力"
        :value="real.mainPress"
        unit="KPa"
        dircetion="center"
        v-show="!isNaN(real.mainPress)"
      ></s-list>
      <s-list
        title="频率"
        :value="real.freq"
        unit="Hz"
        dircetion="center"
        v-show="!isNaN(real.freq)"
      ></s-list>
    </div>
    <div class="power" v-show="!isNaN(real.power)">
      <p>{{ real.power }}</p>
    </div>
    <div class="poolFlow" v-show="!isNaN(real.poolFlow)">
      <p>{{ real.poolFlow }}</p>
    </div>
    <div class="ferBucket1">
      <el-image class="ferPool" src="/image/topological/A桶.png"></el-image>
      <el-image
        class="ferWater"
        :class="{ imageFilter: relay.fer1InValue }"
        src="/image/topological/进水阀.png"
      ></el-image>
      <el-image
        class="ferPump"
        :class="{ imageFilter: relay.fer1OutValue }"
        src="/image/topological/搅拌机.png"
      ></el-image>
      <s-bucket-mask
        class="ferBucket"
        :height="122"
        :width="87"
        :topSemiaxis="10"
        :bottomSemiaxis="250"
        :bottomReserved="13"
        :percentage="getFer1Percentage"
        :color="color"
      ></s-bucket-mask>
    </div>
    <div class="ferBucket2">
      <el-image class="ferPool" src="/image/topological/B桶.png"></el-image>
      <el-image
        class="ferWater"
        :class="{ imageFilter: relay.fer2InValue }"
        src="/image/topological/进水阀.png"
      ></el-image>
      <el-image
        class="ferPump"
        :class="{ imageFilter: relay.fer2OutValue }"
        src="/image/topological/搅拌机.png"
      ></el-image>
      <s-bucket-mask
        class="ferBucket"
        :height="122"
        :width="87"
        :topSemiaxis="10"
        :bottomSemiaxis="250"
        :bottomReserved="13"
        :percentage="getFer2Percentage"
        :color="color"
      ></s-bucket-mask>
    </div>
    <div class="ferBucket3">
      <el-image class="ferPool" src="/image/topological/C桶.png"></el-image>
      <el-image
        class="ferWater"
        :class="{ imageFilter: relay.fer3InValue }"
        src="/image/topological/进水阀.png"
      ></el-image>
      <el-image
        class="ferPump"
        :class="{ imageFilter: relay.fer3OutValue }"
        src="/image/topological/搅拌机.png"
      ></el-image>
      <s-bucket-mask
        class="ferBucket"
        :height="122"
        :width="87"
        :topSemiaxis="10"
        :bottomSemiaxis="250"
        :bottomReserved="13"
        :percentage="getFer3Percentage"
        :color="color"
      ></s-bucket-mask>
    </div>
    <div class="ferBucket4">
      <el-image class="ferPool" src="/image/topological/D桶.png"></el-image>
      <el-image
        class="ferWater"
        :class="{ imageFilter: relay.fer4InValue }"
        src="/image/topological/进水阀.png"
      ></el-image>
      <el-image
        class="ferPump"
        :class="{ imageFilter: relay.fer4OutValue }"
        src="/image/topological/搅拌机.png"
      ></el-image>
      <s-bucket-mask
        class="ferBucket"
        :height="122"
        :width="87"
        :topSemiaxis="10"
        :bottomSemiaxis="250"
        :bottomReserved="13"
        :percentage="getFer4Percentage"
        :color="color"
      ></s-bucket-mask>
    </div>
    <div class="fer1Flow" v-show="!isNaN(real.fer1Flow)">
      <p>{{ real.fer1Flow }}</p>
    </div>
    <div class="fer2Flow" v-show="!isNaN(real.fer2Flow)">
      <p>{{ real.fer2Flow }}</p>
    </div>
    <div class="fer3Flow" v-show="!isNaN(real.fer3Flow)">
      <p>{{ real.fer3Flow }}</p>
    </div>
    <div class="fer4Flow" v-show="!isNaN(real.fer4Flow)">
      <p>{{ real.fer4Flow }}</p>
    </div>

    <div class="machineValve">
      <el-image
        class="green"
        :class="{ greenShadow: relay.MachinePump }"
        src="/image/topological/水肥机按钮01.png"
      ></el-image>
      <el-image
        class="red"
        :class="{ redShadow: !relay.MachinePump }"
        src="/image/topological/水肥机按钮02.png"
      ></el-image>
    </div>
    <div class="machine">
      <s-list
        title="压力"
        :value="real.mainPress"
        unit="KPa"
        dircetion="center"
        v-show="!isNaN(real.mainPress)"
      ></s-list>
      <s-list
        title="EC"
        :value="real.machineEC"
        unit="mS/cm"
        dircetion="center"
        v-show="!isNaN(real.machineEC)"
      ></s-list>
      <s-list
        title="PH"
        :value="real.machinePH"
        dircetion="center"
        v-show="!isNaN(real.machineFlow)"
      ></s-list>
      <s-list
        title="流量"
        :value="real.machineFlow"
        unit="L/min"
        dircetion="center"
        v-show="!isNaN(real.machineFlow)"
      ></s-list>
    </div>

    <!-- <div class="pool" :style="getPercentage"></div> -->
    <s-bucket-mask
      class="pool"
      :height="277"
      :width="116"
      :topSemiaxis="26"
      :bottomSemiaxis="259"
      :bottomReserved="22"
      :percentage="getPoolPercentage"
      :color="color"
    ></s-bucket-mask>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import sBucketMask from './BucketMask.vue'
import sList from './List.vue'

interface TopoRelayInterface {
  mainPump: number; // 主水泵状态
  MachinePump: number; // 施肥泵状态
  fer1InValue: number; // 肥料桶1进水阀状态
  fer1OutValue: number; // 肥料桶1出水阀状态
  fer2InValue: number; // 肥料桶2进水阀状态
  fer2OutValue: number; // 肥料桶2出水阀状态
  fer3InValue: number;
  fer3OutValue: number;
  fer4InValue: number;
  fer4OutValue: number;
}

interface TopoRealInterface {
  power: number; // 电表
  // water: 2, //水表
  freq: number; // 变频柜频率
  mainPress: number; // 主管道压力
  fer1Level: number; // 肥料桶1液位
  fer1Flow: number; // 肥料桶1累计流量
  fer2Level: number; // 肥料桶2液位
  fer2Flow: number; // 肥料桶2累计流量
  fer3Level: number; // 肥料桶3液位
  fer3Flow: number; // 肥料桶3累计流量
  fer4Level: number; // 肥料桶4液位
  fer4Flow: number; // 肥料桶4累计流量
  poolLevel: number; // 水池液位
  poolFlow: number; // 水池累计流量

  machinePress: number; // 水肥机压力
  machineEC: number; // 水肥机电导
  machinePH: number; // 水肥机PH
  machineFlow: number; // 水肥机累计流量
}

interface TopoInfoInterface {
  poolTotalLevel: number; // 单位米
  fer1Height: number;
  fer2Height: number;
  fer3Height: number;
  fer4Height: number;
}

@Component({
  components: {
    sBucketMask,
    sList
  }
})
export default class Status extends Vue {
  private color = [
    {
      color: 'red',
      percentage: 0
    },
    {
      color: 'yellow',
      percentage: 0.2
    },
    {
      color: 'gray',
      percentage: 0.6
    },
    {
      color: 'green',
      percentage: 1
    }
  ];

  @Prop({ type: Object, required: true }) private real!: TopoRealInterface;
  @Prop({ type: Object, required: true }) private relay!: TopoRelayInterface;
  @Prop({ type: Object, required: true }) private info!: TopoInfoInterface;

  private get getPoolPercentage () {
    const level = isNaN(this.real.poolLevel) ? 0 : this.real.poolLevel
    let rate = level / this.info.poolTotalLevel
    if (rate > 1) rate = 1
    if (rate < 0) rate = 0
    return rate
  }

  private get getFer1Percentage () {
    const level = isNaN(this.real.fer1Level) ? 0 : this.real.fer1Level
    let rate = level / this.info.fer1Height
    if (rate > 1) rate = 1
    if (rate < 0) rate = 0
    return rate
  }

  private get getFer2Percentage () {
    const level = isNaN(this.real.fer2Level) ? 0 : this.real.fer2Level
    let rate = level / this.info.fer2Height
    if (rate > 1) rate = 1
    if (rate < 0) rate = 0
    return rate
  }

  private get getFer3Percentage () {
    const level = isNaN(this.real.fer3Level) ? 0 : this.real.fer3Level
    let rate = level / this.info.fer3Height
    if (rate > 1) rate = 1
    if (rate < 0) rate = 0
    return rate
  }

  private get getFer4Percentage () {
    const level = isNaN(this.real.fer4Level) ? 0 : this.real.fer4Level
    let rate = level / this.info.fer4Height
    if (rate > 1) rate = 1
    if (rate < 0) rate = 0
    return rate
  }
}
</script>

<style lang="scss" scoped>
.status {
  // min-width: 7.6rem;
  // min-height: 5.2rem;
  color: black;
  font-size: 0.12rem;
  position: relative;
  z-index: 101;
  .mainPump {
    width: 86px;
    height: 42px;
    text-align: center;
    vertical-align: middle;

    background: white;
    position: absolute;
    left: 148px;
    top: 83px;
  }
  .pump {
    width: 144px;
    height: 103px;
    position: absolute;
    left: 95px;
    top: 56px;
  }
  .power {
    width: 33px;
    height: 8px;
    color: red;
    text-align: center;
    line-height: 8px;
    position: absolute;
    left: 225px;
    top: 22px;
  }

  .mainPumpFilter {
    filter: hue-rotate(-30deg);
  }
  .imageFilter {
    filter: hue-rotate(30deg);
  }

  .ferBucket {
    position: absolute;
    left: 0px;
    top: 48px;
    z-index: 99;
  }
  .ferPool {
    width: 88px;
    height: 137px;
    position: absolute;
    left: 0px;
    top: 38px;
    z-index: 99;
  }
  .ferWater {
    width: 40px;
    height: 44px;
    position: absolute;
    left: 22px;
    top: 0px;
    z-index: 101;
  }
  .ferPump {
    width: 19px;
    height: 21px;
    position: absolute;
    left: 69px;
    top: 29px;
    z-index: 101;
  }

  .ferBucket1 {
    position: absolute;
    left: 306px;
    top: 20px;
    z-index: 100;
  }
  .ferBucket2 {
    position: absolute;
    left: 424px;
    top: 20px;
    z-index: 100;
  }
  .ferBucket3 {
    position: absolute;
    left: 542px;
    top: 20px;
    z-index: 100;
  }
  .ferBucket4 {
    position: absolute;
    left: 661px;
    top: 20px;
    z-index: 100;
  }
  .poolFlow {
    width: 33px;
    height: 8px;
    color: red;
    text-align: center;
    line-height: 8px;
    position: absolute;
    left: 256px;
    top: 192px;
  }
  .fer1Flow {
    width: 34px;
    height: 10px;
    color: red;
    text-align: center;
    position: absolute;
    left: 357px;
    top: 211px;
  }
  .fer2Flow {
    width: 34px;
    height: 10px;
    color: red;
    text-align: center;
    position: absolute;
    left: 478px;
    top: 211px;
  }
  .fer3Flow {
    width: 34px;
    height: 10px;
    color: red;
    text-align: center;
    position: absolute;
    left: 547px;
    top: 211px;
  }
  .fer4Flow {
    width: 34px;
    height: 10px;
    color: red;
    text-align: center;
    position: absolute;
    left: 664px;
    top: 211px;
  }
  .machineValve {
    position: absolute;
    left: 455px;
    top: 244px;
    > div {
      width: 11px;
      height: 10px;
      position: absolute;
    }
    .green {
      left: 0;
      top: 0;
    }
    .greenShadow {
      box-shadow: 0 0 2px 2px green;
    }
    .red {
      left: 23px;
      top: 0;
    }
    .redShadow {
      box-shadow: 0 0 2px 2px red;
    }
  }
  .machine {
    width: 177px;
    position: absolute;
    left: 438px;
    top: 376px;
  }
  .pool {
    position: absolute;
    left: 7px;
    top: 183px;
  }
}
</style>
