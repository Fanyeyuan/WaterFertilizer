<template>
  <div class="clock">
    <div class="date">
      {{ date }}
    </div>
    <el-row
      :gutter="0"
      type="flex"
      align="middle"
      justify="space-around"
      v-if="value.length"
    >
      <el-col :span="3" v-for="index in 8" :key="index">
        <div class="colon" v-if="index % 3 === 0">
          <span v-show="value[5] % 2">:</span>
        </div>
        <segment
          :width="width"
          :lineWidth="lineWidth"
          :interval="interval"
          :color="color"
          :value="value[index - 1 - Math.floor(index / 3)]"
          v-else
        >
        </segment>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Segment from './Segment.vue'

import { Row, Col } from 'element-ui'
Vue.use(Row)
Vue.use(Col)

@Component({
  components: {
    Segment
  }
})
export default class Clock extends Vue {
  @Prop({ type: Number, default: 25 }) private readonly width!: number;
  @Prop({ type: Number, default: 3 }) private readonly lineWidth!: number;
  @Prop({ type: Number, default: 1 }) private readonly interval!: number;
  @Prop({ type: String, default: 'white' }) private readonly color!: string;

  private readonly week: string[] = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];

  private date = '';
  private value: string[] = [];

  get getWidth () {
    const deviceWidth =
      document.documentElement.clientWidth || window.innerWidth
    return (this.width / 1024) * deviceWidth
  }

  get getLineWidth () {
    const deviceWidth =
      document.documentElement.clientWidth || window.innerWidth
    return (this.lineWidth / 1024) * deviceWidth
  }

  get getInterval () {
    const deviceWidth =
      document.documentElement.clientWidth || window.innerWidth
    return (this.interval / 1024) * deviceWidth
  }

  private PrefixInteger (num: number, length: number) {
    return (Array(length).join('0') + num).slice(-length)
  }

  private getClock () {
    let result = ''
    const date = new Date()
    result += this.PrefixInteger(date.getHours(), 2)
    result += this.PrefixInteger(date.getMinutes(), 2)
    result += this.PrefixInteger(date.getSeconds(), 2)

    let result2 = ''
    result2 += this.PrefixInteger(date.getFullYear(), 4) + '/'
    result2 += this.PrefixInteger(date.getMonth() + 1, 2) + '/'
    result2 += this.PrefixInteger(date.getDate(), 2) + ' '
    result2 += this.week[date.getDay()]

    // result.split("").map((value: string, index: number) => {
    //   this.$set(this.value, index, value);
    // });
    const clock = result.split('')
    this.value.splice(0, 6, ...clock)
    this.date = result2
  }

  private mounted () {
    this.getClock()
    setInterval(this.getClock, 1000)
  }
}
</script>

<style lang="scss" scoped>
.clock {
  // transform-origin: center top;
  // transform: scale(0.5);
  padding: 0 0.1rem 0 0.1rem;
  .date {
    text-align: center;
    padding: 0.1rem 0 0.1rem 0;
    font-size: 0.28rem;
  }
  .colon {
    text-align: center;
    span {
      font-size: 0.3rem;
    }
  }
}
</style>
