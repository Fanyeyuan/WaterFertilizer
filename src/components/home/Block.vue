<template>
  <div class="top">
    <div class="block" :style="getBlockSize">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Block extends Vue {
  @Prop({ type: Number }) private readonly height!: number;
  @Prop({ required: true, type: Number }) private readonly width!: number;
  @Prop({ required: true, type: String }) private readonly title!: string;

  get getBlockSize () {
    return {
      width: this.width + 'rem',
      height: this.height + 'rem'
    }
  }
}
</script>

<style lang="scss" scoped>
// .top {
//   display: inline-block;
//   div {
//     display: inline-block;
//   }
// }
.block {
  // width: 2rem;
  // height: 1rem;
  position: relative;
  border: 1px solid rgba(68, 142, 168, 0.6);
  border-radius: 0.1rem;

  ul {
    &:first-child {
      li {
        position: absolute;
        display: block;
        padding: 0.1rem;
        border: solid #44a7df;

        &:nth-of-type(1) {
          top: 0;
          left: 0;
          border-width: 2px 0 0 2px;
          border-top-left-radius: 50%;
        }
        &:nth-of-type(2) {
          top: 0;
          right: 0;
          border-width: 2px 2px 0 0;
          border-top-right-radius: 50%;
        }
        &:nth-of-type(3) {
          bottom: 0;
          right: 0;
          border-width: 0 2px 2px 0;
          border-bottom-right-radius: 50%;
        }
        &:nth-of-type(4) {
          bottom: 0;
          left: 0;
          border-width: 0 0 2px 2px;
          border-bottom-left-radius: 50%;
        }
      }
    }
  }

  .title {
    color: #dfe5dd;
    height: 0.3rem;
    width: 0.9rem;
    margin: 0.05rem;
    line-height: 0.3rem;
    text-align: center;
    font-size: 0.1rem;
    background: url("~@/assets/image/title_background.c249a313.png") no-repeat
      center;
    background-size: contain;
  }
}
</style>
