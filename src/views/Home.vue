<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <button
      v-for="(item, index) in items"
      :key="index"
      @click="onButtonClick(item, index)"
    >
      JK{{ index }}--{{ item }}
    </button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data () {
    return {
      items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    }
  },
  methods: {
    onButtonClick (item, index) {
      this.items[index] = Number(1 - this.items[index])
      ipc.send("setRelay", { // eslint-disable-line
        id: 15112501,
        start: index,
        state: this.items[index]
      })
      console.log(this.items, item)
    }
  },
  components: {
    HelloWorld
  }
}
</script>
