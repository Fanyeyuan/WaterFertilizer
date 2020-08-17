<template>
  <div class="header">
    <div class="title">{{ header }}</div>
    <el-button
      class="full"
      type="primary"
      icon="el-icon-full-screen"
      plain
    ></el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Button } from 'element-ui'

Vue.use(Button)

@Component
export default class Header extends Vue {
  @Prop({ required: true, type: String }) private readonly header!: string;
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 0.45rem;
  .title {
    line-height: 0.45rem;
    font-size: 1.5em;
    text-align: center;
  }
  .full {
    position: absolute;
    top: 0.04rem;
    right: 0.04rem;

    padding: 0;
    background-color: transparent;
    border: none;
    font-size: 0.2rem;
    &:hover {
      color: gray;
    }
  }
}
</style>
