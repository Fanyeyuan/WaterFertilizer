<template>
  <canvas ref="LED">
    {{ "浏览器\r不支持" }}
  </canvas>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'

@Component
export default class Segment extends Vue {
  @Prop({ type: Number, default: 30 }) private readonly width!: number;
  @Prop({ type: Number, default: 5 }) private readonly lineWidth!: number;
  @Prop({ type: String, default: 8 }) private readonly value!: string;
  @Prop({ type: Number, default: 1 }) private readonly interval!: number;
  @Prop({ type: String, default: 'white' }) private readonly color!: string;

  @Ref('LED') readonly canvas!: HTMLCanvasElement;

  private get space () {
    return Math.SQRT2 * this.interval
  }

  // 线条的宽度和高度
  private get h () {
    return this.width - 2 * this.space
  }

  private get w () {
    return this.lineWidth
  }

  // 数码管的宽度，高度
  private get height () {
    return 3 * this.space + 2 * this.h
  }

  private mounted () {
    this.drawLED()
  }

  @Watch('value')
  private onValueChange () {
    this.drawLED()
  }

  private drawLED () {
    if (!this.value) {
      return
    }
    const canvas = this.canvas
    canvas.width = this.width
    canvas.height = this.height
    const canvasRenderContext2D = canvas.getContext('2d')
    const invokeNumber = {
      0: [
        this.leftTop,
        this.top,
        this.rightTop,
        this.leftBottom,
        this.bottom,
        this.rightBottom
      ],
      1: [this.rightTop, this.rightBottom],
      2: [this.top, this.rightTop, this.center, this.leftBottom, this.bottom],
      3: [this.top, this.rightTop, this.center, this.bottom, this.rightBottom],
      4: [this.leftTop, this.rightTop, this.center, this.rightBottom],
      5: [this.leftTop, this.top, this.center, this.bottom, this.rightBottom],
      6: [
        this.leftTop,
        this.top,
        this.center,
        this.leftBottom,
        this.bottom,
        this.rightBottom
      ],
      7: [this.top, this.rightTop, this.rightBottom],
      8: [
        this.leftTop,
        this.top,
        this.rightTop,
        this.center,
        this.leftBottom,
        this.bottom,
        this.rightBottom
      ],
      9: [
        this.leftTop,
        this.top,
        this.rightTop,
        this.center,
        this.bottom,
        this.rightBottom
      ]
    }

    for (const func of invokeNumber[this.value]) {
      func.call(this, canvasRenderContext2D)
    }
  }

  private rightBottom (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(this.width, 2 * this.space + this.h)
    canvasRenderContext2D.lineTo(this.width, 2 * this.space + 2 * this.h)
    canvasRenderContext2D.lineTo(
      this.width - this.w,
      2 * this.space + 2 * this.h - this.w
    )
    canvasRenderContext2D.lineTo(
      this.width - this.w,
      2 * this.space + this.h + this.w
    )
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private bottom (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(this.space, 3 * this.space + 2 * this.h)
    canvasRenderContext2D.lineTo(
      this.space + this.w,
      3 * this.space + 2 * this.h - this.w
    )
    canvasRenderContext2D.lineTo(
      this.space + this.h - this.w,
      3 * this.space + 2 * this.h - this.w
    )
    canvasRenderContext2D.lineTo(
      this.space + this.h,
      3 * this.space + 2 * this.h
    )
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private leftBottom (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(0, 2 * this.space + this.h)
    canvasRenderContext2D.lineTo(this.w, 2 * this.space + this.h + this.w)
    canvasRenderContext2D.lineTo(this.w, 2 * this.space + 2 * this.h - this.w)
    canvasRenderContext2D.lineTo(0, 2 * this.space + 2 * this.h)
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private center (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(this.space, 2 * this.space + this.h)
    canvasRenderContext2D.lineTo(
      this.space + this.w,
      2 * this.space + this.h - this.w
    )
    canvasRenderContext2D.lineTo(
      this.space + this.h - this.w,
      2 * this.space + this.h - this.w
    )
    canvasRenderContext2D.lineTo(this.space + this.h, 2 * this.space + this.h)
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private rightTop (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(this.width, this.space)
    canvasRenderContext2D.lineTo(this.width, this.space + this.h)
    canvasRenderContext2D.lineTo(
      this.width - this.w,
      this.space + this.h - this.w
    )
    canvasRenderContext2D.lineTo(this.width - this.w, this.w + this.space)
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private top (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(this.space, 0)
    canvasRenderContext2D.lineTo(this.space + this.h, 0)
    canvasRenderContext2D.lineTo(this.space + this.h - this.w, this.w)
    canvasRenderContext2D.lineTo(this.space + this.w, this.w)
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }

  private leftTop (canvasRenderContext2D: CanvasRenderingContext2D) {
    canvasRenderContext2D.beginPath()
    canvasRenderContext2D.moveTo(0, this.space)
    canvasRenderContext2D.lineTo(this.w, this.w + this.space)
    canvasRenderContext2D.lineTo(this.w, this.space + this.h - this.w)
    canvasRenderContext2D.lineTo(0, this.space + this.h)
    canvasRenderContext2D.closePath()
    canvasRenderContext2D.fillStyle = this.color
    canvasRenderContext2D.fill()
  }
}
</script>

<style scoped></style>
