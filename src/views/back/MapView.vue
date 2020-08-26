<template>
  <div class="map" ref="map">
    <img :width="width" :height="height" :src="src" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

@Component
export default class MapView extends Vue {
  @Ref() private readonly map!: HTMLDivElement;
  private width = 280;
  private height = 140;
  private src = '';

  private mounted () {
    console.log(this.map.clientHeight, this.map.clientWidth)
    this.width = this.map.clientWidth - 5
    this.height = this.map.clientHeight - 5
    this.src = `http://api.map.baidu.com/staticimage/v2?ak=d0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5&width=${this.width}&height=${this.height}&zoom=11&copyright=2&dpiType=pl`
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
