<template>
  <div class="progress">
    <div class="title">
      <span :class="getTextClass" :title="title">{{ title }}</span>
    </div>
    <el-progress
      :text-inside="textInside"
      :stroke-width="strokeWidth"
      :percentage="getPerCentage"
      :color="color"
    ></el-progress>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Progress as ElProgress } from 'element-ui'
Vue.use(ElProgress)

@Component
export default class Progress extends Vue {
  @Prop({ required: true, type: String }) private title!: string;
  @Prop({
    required: true,
    type: Number,
    validator: (value: number) => value >= 0 && value <= 100
  })
  private percentage!: number;

  @Prop({ type: Number, default: 1 }) private point!: number;
  @Prop({ type: Number, default: 22 }) private strokeWidth!: number;
  @Prop({ type: Boolean, default: true }) private textInside!: boolean;
  @Prop({
    type: [Array, Function, String],
    default: () => [
      { color: '#f56c6c', percentage: 20 },
      { color: '#6f7ad3', percentage: 40 },
      { color: '#e6a23c', percentage: 60 },
      { color: '#1989fa', percentage: 80 },
      { color: '#5cb87a', percentage: 100 }
    ]
  })
  private color!: Record<string, any>[] | Function | string;

  private getTextClass () {
    return {
      'line-height': this.strokeWidth
    }
  }

  private get getPerCentage (): number {
    const result: string = this.percentage.toFixed(this.point)
    return Number(result)
  }
}
</script>

<style lang="scss" scoped>
.progress {
  position: relative;
  margin-bottom: 0.05rem;
  width: 100%;

  .title {
    position: absolute;
    width: 70%;
    left: 15%;
    top: 0;
    line-height: 22px;
    text-align: center;
    z-index: 100;
    color: white;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    span {
      color: white;
      background: rgba($color: gray, $alpha: 0.5);
    }
  }
}
</style>
<style>
.el-progress-bar__outer {
  width: 100%;
  /* background: rgba(0, 0, 0, 0.5) !important; */
}
</style>
