<template>
  <div class="pipe">
    <s-pipe
      class="pipe1"
      :width="98"
      :height="12"
      :direction="-90"
      :borderRadius="[0, 12, 0, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe2"
      :width="60"
      :height="12"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe3"
      :width="99"
      :height="12"
      :direction="-90"
      :borderRadius="[0, 12, 0, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe4"
      :width="154"
      :height="12"
      :borderRadius="[0, 12, 0, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe5"
      :width="163"
      :height="12"
      :direction="90"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe6"
      :width="135"
      :height="12"
      :direction="180"
      :borderRadius="[0, 0, 12, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe7"
      :width="135"
      :height="12"
      :direction="90"
      :borderRadius="[0, 0, 12, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe8"
      :width="60"
      :height="12"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe9"
      :width="60"
      :height="12"
      :borderRadius="[0, 12, 0, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe10"
      :width="56"
      :height="12"
      :direction="90"
      :borderRadius="[0, 12, 0, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe11"
      :width="255"
      :height="12"
      :direction="180"
      :borderRadius="[0, 0, 12, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe12"
      :width="88"
      :height="12"
      :direction="90"
      :borderRadius="[0, 0, 12, 0]"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <s-pipe
      class="pipe13"
      :width="280"
      :height="13"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
    <div class="ferChannel1">
      <s-pipe
        class="pipe14"
        :width="16"
        :height="7"
        :direction="180"
        :borderRadius="[7, 0, 0, 0]"
        :isFlow="relay.fer1InValue === 1"
      ></s-pipe>
      <s-pipe
        class="pipe15"
        :width="23"
        :height="7"
        :direction="90"
        :isFlow="relay.fer1InValue === 1"
      ></s-pipe>
    </div>
    <div class="ferChannel2">
      <s-pipe
        class="pipe14"
        :width="16"
        :height="7"
        :direction="180"
        :borderRadius="[7, 0, 0, 0]"
        :isFlow="relay.fer2InValue === 1"
      ></s-pipe>
      <s-pipe
        class="pipe15"
        :width="23"
        :height="7"
        :direction="90"
        :isFlow="relay.fer2InValue === 1"
      ></s-pipe>
    </div>
    <div class="ferChannel3">
      <s-pipe
        class="pipe14"
        :width="16"
        :height="7"
        :direction="180"
        :borderRadius="[7, 0, 0, 0]"
        :isFlow="relay.fer3InValue === 1"
      ></s-pipe>
      <s-pipe
        class="pipe15"
        :width="23"
        :height="7"
        :direction="90"
        :isFlow="relay.fer3InValue === 1"
      ></s-pipe>
    </div>
    <div class="ferChannel4">
      <s-pipe
        class="pipe14"
        :width="16"
        :height="7"
        :direction="180"
        :borderRadius="[7, 0, 0, 0]"
        :isFlow="relay.fer4InValue === 1"
      ></s-pipe>
      <s-pipe
        class="pipe15"
        :width="23"
        :height="7"
        :direction="90"
        :isFlow="relay.fer4InValue === 1"
      ></s-pipe>
    </div>
    <s-pipe
      class="pipe16"
      :width="391"
      :height="7"
      :direction="180"
      :borderRadius="[3.5, 3.5, 3.5, 3.5]"
      :isFlow="
        relay.fer1InValue === 1 ||
          relay.fer2InValue === 1 ||
          relay.fer3InValue === 1 ||
          relay.fer4InValue === 1
      "
    ></s-pipe>
    <s-pipe
      class="pipe17"
      :width="50"
      :height="8"
      :direction="90"
      :borderRadius="[4, 0, 7, 4]"
      :isFlow="relay.fer1OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe18"
      :width="94"
      :height="7"
      :borderRadius="[0, 7, 0, 0]"
      :isFlow="relay.fer1OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe19"
      :width="17"
      :height="7"
      :direction="90"
      :isFlow="relay.fer1OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe20"
      :width="50"
      :height="8"
      :direction="90"
      :borderRadius="[4, 0, 7, 4]"
      :isFlow="relay.fer2OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe21"
      :width="47"
      :height="7"
      :borderRadius="[0, 7, 0, 0]"
      :isFlow="relay.fer2OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe22"
      :width="17"
      :height="7"
      :direction="90"
      :isFlow="relay.fer2OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe23"
      :width="50"
      :height="8"
      :direction="90"
      :borderRadius="[4, 7, 0, 4]"
      :isFlow="relay.fer3OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe24"
      :width="47"
      :height="7"
      :direction="180"
      :borderRadius="[0, 0, 7, 0]"
      :isFlow="relay.fer3OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe25"
      :width="17"
      :height="7"
      :direction="90"
      :isFlow="relay.fer3OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe26"
      :width="50"
      :height="8"
      :direction="90"
      :borderRadius="[4, 7, 0, 4]"
      :isFlow="relay.fer4OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe27"
      :width="92"
      :height="7"
      :direction="180"
      :borderRadius="[0, 0, 7, 0]"
      :isFlow="relay.fer4OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe28"
      :width="17"
      :height="7"
      :direction="90"
      :isFlow="relay.fer4OutValue === 1"
    ></s-pipe>
    <s-pipe
      class="pipe29"
      :width="80"
      :height="14"
      :isFlow="relay.mainPump === 1"
    ></s-pipe>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import sPipe from './Pipe.vue'

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

@Component({
  components: {
    sPipe
  }
})
export default class PipePic extends Vue {
  @Prop({ type: Object, required: true }) private relay!: TopoRelayInterface;
}
</script>

<style lang="scss" scoped>
.pipe {
  position: relative;
  .pipe1 {
    position: absolute;
    z-index: 100;
    left: 11px;
    top: 152px;
  }
  .pipe2 {
    position: absolute;
    z-index: 100;
    left: 65px;
    top: 109px;
  }
  .pipe3 {
    position: absolute;
    z-index: 100;
    left: 70px;
    top: 54px;
  }
  .pipe4 {
    position: absolute;
    z-index: 100;
    left: 125px;
    top: 10px;
  }
  .pipe5 {
    position: absolute;
    z-index: 100;
    left: 191px;
    top: 97px;
  }
  .pipe6 {
    position: absolute;
    z-index: 100;
    left: 132px;
    top: 173px;
  }
  .pipe7 {
    position: absolute;
    z-index: 100;
    left: 70px;
    top: 246px;
  }
  .pipe8 {
    position: absolute;
    z-index: 100;
    left: 143px;
    top: 308px;
  }
  .pipe9 {
    position: absolute;
    z-index: 100;
    left: 355px;
    top: 323px;
  }
  .pipe10 {
    position: absolute;
    z-index: 100;
    left: 382px;
    top: 357px;
  }
  .pipe11 {
    position: absolute;
    z-index: 100;
    left: 149px;
    top: 379px;
  }
  .pipe12 {
    position: absolute;
    z-index: 100;
    left: 110px;
    top: 429px;
  }
  .pipe13 {
    position: absolute;
    z-index: 100;
    left: 159px;
    top: 466px;
  }
  .pipe14 {
    position: absolute;
    z-index: 100;
    left: 0px;
    top: 15px;
  }
  .pipe15 {
    position: absolute;
    z-index: 100;
    left: 1px;
    top: 0;
  }
  .ferChannel1 {
    position: absolute;
    z-index: 100;
    left: 359px;
    top: 22px;
  }
  .ferChannel2 {
    position: absolute;
    z-index: 100;
    left: 478px;
    top: 22px;
  }
  .ferChannel3 {
    position: absolute;
    z-index: 100;
    left: 596px;
    top: 22px;
  }
  .ferChannel4 {
    position: absolute;
    z-index: 100;
    left: 714px;
    top: 22px;
  }
  .pipe16 {
    position: absolute;
    z-index: 100;
    left: 368px;
    top: 9px;
  }
  .pipe17 {
    position: absolute;
    z-index: 105;
    left: 325px;
    top: 193px;
  }
  .pipe18 {
    position: absolute;
    z-index: 100;
    left: 351px;
    top: 214px;
  }
  .pipe19 {
    position: absolute;
    z-index: 100;
    left: 433px;
    top: 226px;
  }
  .pipe20 {
    position: absolute;
    z-index: 105;
    left: 444px;
    top: 193px;
  }
  .pipe21 {
    position: absolute;
    z-index: 100;
    left: 471px;
    top: 214px;
  }
  .pipe22 {
    position: absolute;
    z-index: 100;
    left: 506px;
    top: 226px;
  }
  .pipe23 {
    position: absolute;
    z-index: 105;
    left: 562px;
    top: 193px;
  }
  .pipe24 {
    position: absolute;
    z-index: 100;
    left: 535px;
    top: 215px;
  }
  .pipe25 {
    position: absolute;
    z-index: 100;
    left: 530px;
    top: 226px;
  }
  .pipe26 {
    position: absolute;
    z-index: 105;
    left: 680px;
    top: 193px;
  }
  .pipe27 {
    position: absolute;
    z-index: 100;
    left: 610px;
    top: 215px;
  }
  .pipe28 {
    position: absolute;
    z-index: 100;
    left: 605px;
    top: 226px;
  }
  .pipe29 {
    position: absolute;
    z-index: 100;
    left: 618px;
    top: 467px;
  }
}
</style>
