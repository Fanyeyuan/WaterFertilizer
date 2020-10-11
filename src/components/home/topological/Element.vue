<template>
  <div class="element">
    <el-image class="pool" src="/image/topological/水桶.png"></el-image>
    <el-image class="valve" src="/image/topological/阀门.png"></el-image>
    <el-image class="pump" src="/image/topological/水泵.png"></el-image>
    <el-image class="power" src="/image/topological/表1-1.png"></el-image>
    <el-image class="water" src="/image/topological/表2-1.png"></el-image>
    <el-image class="sand" src="/image/topological/沙石过滤器.png"></el-image>
    <el-image
      class="lamination"
      src="/image/topological/叠片过滤器.png"
    ></el-image>
    <el-image
      class="ferFlow1"
      src="/image/topological/水肥机阀控.png"
    ></el-image>
    <el-image
      class="ferFlow2"
      src="/image/topological/水肥机阀控.png"
    ></el-image>
    <el-image
      class="ferFlow3"
      src="/image/topological/水肥机阀控.png"
    ></el-image>
    <el-image
      class="ferFlow4"
      src="/image/topological/水肥机阀控.png"
    ></el-image>
    <el-image
      class="WaterMachine"
      src="/image/topological/水肥机.png"
    ></el-image>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Image } from 'element-ui'
Vue.use(Image)

@Component
export default class Element extends Vue {}
</script>

<style lang="scss" scoped>
.element {
  position: relative;
  .pool {
    width: 117px;
    height: 289px;
    position: absolute;
    left: 7px;
    top: 185px;
    z-index: 99;
  }
  .valve {
    width: 26px;
    height: 36px;
    position: absolute;
    left: 126px;
    top: 200px;
    z-index: 101;
  }
  .pump {
    width: 144px;
    height: 103px;
    position: absolute;
    left: 95px;
    top: 56px;
    z-index: 101;
  }
  .power {
    width: 50px;
    height: 40px;
    position: absolute;
    left: 217px;
    top: 10px;
    z-index: 101;
  }
  .water {
    width: 62px;
    height: 62px;
    position: absolute;
    left: 238px;
    top: 147px;
    z-index: 101;
  }
  .sand {
    width: 230px;
    height: 140px;
    position: absolute;
    left: 145px;
    top: 222px;
    z-index: 101;
  }
  .lamination {
    width: 232px;
    height: 105px;
    position: absolute;
    left: 175px;
    top: 386px;
    z-index: 101;
  }
  .ferFlow1 {
    width: 42px;
    height: 23px;
    position: absolute;
    left: 353px;
    top: 201px;
    z-index: 101;
  }
  .ferFlow2 {
    width: 42px;
    height: 23px;
    position: absolute;
    left: 473px;
    top: 201px;
    z-index: 101;
  }
  .ferFlow3 {
    width: 42px;
    height: 23px;
    position: absolute;
    left: 543px;
    top: 201px;
    z-index: 101;
  }
  .ferFlow4 {
    width: 42px;
    height: 23px;
    position: absolute;
    left: 660px;
    top: 201px;
    z-index: 101;
  }
  .WaterMachine {
    width: 196px;
    height: 281px;
    position: absolute;
    left: 420px;
    top: 238px;
    z-index: 101;
  }
}
</style>
