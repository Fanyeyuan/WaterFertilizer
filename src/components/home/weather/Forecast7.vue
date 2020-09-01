<template>
  <div class="frameContainer">
    <iframe
      src="https://apip.weatherdt.com/v2/h5.html?bg=1&md=4&lc=auto&key=feJMjhDUcK"
      frameborder="0"
      class="frame"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Forecast7 extends Vue {}
</script>

<style lang="scss" scoped>
.frameContainer {
  width: 100%;
  .frame {
    width: 100%;
    height: 1rem;
    // transform: scale(0.5);
  }
}
</style>
