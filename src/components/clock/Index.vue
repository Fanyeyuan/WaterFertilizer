<template>
  <div>
    <segment v-for="index in 6" :key="index">
      <!-- <segment :value="index.toString()"></segment>
      <span v-if="index % 2 === 0">:</span> -->
    </segment>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Segment from './Segment.vue'

@Component({
  components: {
    Segment
  }
})
export default class Clock extends Vue {}
</script>

<style scoped></style>
