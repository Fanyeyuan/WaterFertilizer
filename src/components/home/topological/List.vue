<template>
  <div class="list" :class="getDirction">
    <div>{{ title }}</div>
    <div>{{ getValue }}</div>
    <div>{{ unit }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class List extends Vue {
  @Prop({ type: String, required: true }) title!: string;
  @Prop({ type: String, default: '' }) unit!: string;
  @Prop({ type: Number, required: true }) value!: number;
  @Prop({ type: Number, default: 0 }) point!: number;
  @Prop({
    type: String,
    default: 'left',
    validator: (value: string) => {
      return ['left', 'right', 'center'].indexOf(value) !== -1
    }
  })
  dircetion!: string;

  private get getValue () {
    return this.value.toFixed(this.point)
  }

  private get getDirction () {
    return 'list-align-' + this.dircetion
  }
}
</script>

<style lang="scss" scoped>
$dirction: left, right, center;

@each $dir in $dirction {
  .list-align-#{$dir} {
    text-align: $dir;
  }
}
.list {
  display: flex;
  justify-content: space-between;
  > div {
    &:nth-child(1) {
      width: 0.4rem;
    }
    &:nth-child(2) {
      flex: 1;
    }
    &:nth-child(3) {
      width: 0.5rem;
    }
  }
}
</style>
