<template>
  <div class="pipe">
    <!-- 管道主体 -->
    <div
      class="main"
      :class="[getPipeBackgroud]"
      :style="[getPipeBorder, getPipeRect, getPipeRotate]"
    ></div>
  </div>
</template>

<script lang="ts">
import { type } from 'process'
import { stringify } from 'querystring'
import { Component, Prop, Vue } from 'vue-property-decorator'

// 参数校验函数
function stringNumberVilidator (value: any) {
  if (typeof value === 'string') {
    if (
      value.indexOf('%') !== -1 ||
      value.indexOf('px') !== -1 ||
      value === 'none'
    ) {
      return true
    }
    return false
  } else if (typeof value === 'number') {
    return true
  }
  return false
}
function paramVilidator (value: any) {
  if (stringNumberVilidator(value)) {
    return true
  } else if (value instanceof Array) {
    if (value.length > 4) return false
    return value.every(stringNumberVilidator)
  }
  return false
}

@Component
export default class Pipe extends Vue {
  // 单位名称 默认为像素单位
  @Prop({ type: String, default: 'px' }) private unit!: string;
  // 管道的宽高，必须，如果为Number型，则为Number px, 如果为string 则直接赋值
  @Prop({
    required: true,
    type: [Number, String],
    validator: stringNumberVilidator
  })
  private width!: number | string;

  @Prop({
    required: true,
    type: [Number, String],
    validator: stringNumberVilidator
  })
  private height!: number | string;

  /**
   * 圆角方向 可以为字符串或者字符串数组
   * 数组是字符串的集合，字符串的值都可以
   */
  @Prop({
    type: [String, Number, Array],
    default: 'none',
    validator: paramVilidator
  })
  private borderRadius!: number | string | string[];

  /**
   * 边框宽度
   */
  @Prop({
    type: [Number, String, Array],
    default: 1,
    validator: paramVilidator
  })
  private borderWidth!: number | string | string[];

  /**
   * 边框颜色
   */
  @Prop({ type: [String, Array], default: 'black' })
  private borderColor!: string | string[];

  /**
   * 管道是否流动
   */
  @Prop({ type: Boolean, default: false }) private isFlow!: boolean;
  /**
   * 管道方向  horizontal 水平的， vertical 垂直的
   * 旋转角度
   */
  @Prop({
    type: Number,
    default: 0,
    validator: (value: number) => {
      return value <= 360
    }
  })
  private direction!: string;

  private getPipeSize (num: string | number): string {
    if (typeof num === 'number') {
      return num + this.unit
    } else {
      return num
    }
  }

  // 管道的宽高
  private get getPipeRect () {
    const width = ''
    const height = ''
    return {
      width: this.getPipeSize(this.width),
      height: this.getPipeSize(this.height)
    }
  }

  private getBorderParam (param: number | string | (number | string)[]): string {
    if (typeof param === 'number') {
      return param + this.unit
    } else if (typeof param === 'string') {
      return param
    } else if (param instanceof Array) {
      const result = param.map((value: number | string) => {
        return this.getBorderParam(value)
      })
      return result.join(' ')
    }
    return ''
  }

  // 管道的边框
  private get getPipeBorder () {
    return {
      'border-width': this.getBorderParam(this.borderWidth),
      'border-radius': this.getBorderParam(this.borderRadius),
      'border-color': this.getBorderParam(this.borderColor)
    }
  }

  private get getPipeBackgroud () {
    return {
      flow: this.isFlow
    }
  }

  private get getPipeRotate () {
    return {
      transform: `rotate(${this.direction}deg)`
    }
  }
}
</script>

<style lang="scss" scoped>
.pipe {
  .main {
    background: white;
  }

  .rotate {
    transform: rotate(-90deg);
  }

  .flow {
    background-image: url(/image/topological/flow.jpg);
    background-repeat: repeat-x;
    // transform: rotate3d(0, 0, 0);
    // background-position: center center;
    // background-size: cover;
    background-position: -10px center;
    // transform-origin: left top;
    animation: waterFlow linear 1s infinite;
  }

  @keyframes waterFlow {
    0% {
      background-position: -40px center;
    }
    100% {
      background-position: 0 center;
    }
  }
}
</style>
