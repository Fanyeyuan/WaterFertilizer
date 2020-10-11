<template>
  <div class="bucket">
    <div class="mask" :style="getMaskStyle"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface MaskColorInterface {
  color: string;
  percentage: number;
}

@Component
export default class BucketMask extends Vue {
  /**
   * 桶掩层的最大高度 类型数值
   */
  @Prop({ type: Number, required: true }) private height!: number;

  /**
   * 桶掩层的最大宽度 类型数值
   */
  @Prop({ type: Number, required: true }) private width!: number;

  /**
   * 桶掩层的桶顶短轴
   * 长半轴 semimajor axis  短半轴 semiaxisS
   */
  @Prop({ type: Number, required: true }) private topSemiaxis!: number;

  /**
   * 桶掩层的桶底短轴
   * 长半轴 semimajor axis  短半轴 semiaxisS
   */
  @Prop({ type: Number, required: true }) private bottomSemiaxis!: number;

  /**
   * 桶掩层的透明度
   * 0~1
   */
  @Prop({
    type: Number,
    default: 0.6,
    validator: (value: number) => {
      if (value > 1 || value < 0) return false
      return true
    }
  })
  private opacity!: number;

  /**
   * 桶掩层的最大底部预留宽度 类型数值
   * 如果底部不为直线，则为最低直线到底部的距离
   */
  @Prop({ type: Number, default: 22 }) private bottomReserved!: number;
  /**
   * 数值类型的单位，默认单位
   */
  @Prop({ type: String, default: 'px' }) private unit!: number;

  /**
   * 桶掩层的背景颜色
   * 如果为string 类型则，一直保持相同的颜色
   * 如果为array 类型，则不同的百分比显示不同的颜色
   */
  @Prop({ type: [String, Array], default: 'transparent' })
  private color!: string | MaskColorInterface[];

  /**
   * 桶掩层占整体的百分比
   * 范围 0~1
   */
  @Prop({
    type: Number,
    required: true,
    validator: (value: number) => {
      if (value > 1 || value < 0) return false
      return true
    }
  })
  private percentage!: number;

  private get getMaskStyle () {
    return {
      '--percentage': this.percentage,
      '--height': this.height - this.bottomReserved,
      '--opacity': this.opacity,
      '--bottomReserved': this.bottomReserved,
      '--color': this.getMaskColor,
      '--width': this.width,
      '--topSemiaxis': this.topSemiaxis,
      '--bottomSemiaxis': this.bottomSemiaxis
    }
  }

  private get getMaskColor () {
    if (typeof this.color === 'string') {
      return this.color
    } else if (this.color instanceof Array) {
      const color = this.color
        .slice()
        .sort((color: MaskColorInterface, color2: MaskColorInterface) => {
          return color.percentage - color2.percentage
        })
      const result = color.find(
        (color: MaskColorInterface) => color.percentage >= this.percentage
      )
      if (result) return result.color
      else return 'red'
    } else {
      return 'transparent'
    }
  }
}
</script>

<style lang="scss" scoped>
.bucket {
  position: relative;
  .mask {
    //变量声明区
    --height: 255; //容器高度
    --percentage: 0.1; //容器占用的百分比
    --maskHeight: calc(var(--height) * var(--percentage, 1));

    //css区
    position: absolute;
    top: calc(calc(var(--height) - var(--maskHeight)) * 1px);
    width: calc(var(--width) * 1px);
    height: calc(var(--topSemiaxis) * 1px);
    background: var(--color);
    border-bottom-left-radius: calc(var(--width) * 1px)
      calc(var(--topSemiaxis) * 1px);
    border-bottom-right-radius: calc(var(--width) * 1px)
      calc(var(--topSemiaxis) * 1px);
    border-top-left-radius: calc(var(--width) * 1px)
      calc(var(--topSemiaxis) * 1px);
    border-top-right-radius: calc(var(--width) * 1px)
      calc(var(--topSemiaxis) * 1px);
    opacity: var(--opacity);
    &:after {
      content: "";
      display: inline-block;
      width: calc(var(--width) * 1px);
      height: calc(calc(var(--maskHeight) + var(--bottomReserved)) * 1px);
      position: relative;
      opacity: var(--opacity);
      background: var(--color);
      top: 50%;
      border-bottom-left-radius: calc(var(--bottomSemiaxis) * 1px)
        calc(var(--width) * 1px);
      border-bottom-right-radius: calc(var(--bottomSemiaxis) * 1px)
        calc(var(--width) * 1px);
    }
  }
}
</style>
