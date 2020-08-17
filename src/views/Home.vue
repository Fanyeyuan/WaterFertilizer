<template>
  <div class="home">
    <s-header :header="header"></s-header>
    <div class="body">
      <s-block :width="2" :height="1" title="时间日期">
        <s-clock></s-clock>
      </s-block>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'

import sHeader from '@/components/home/Header.vue'

import sBlock from '@/components/home/Block.vue'

import sClock from '@/components/clock/Index.vue'

@Component({
  components: {
    sHeader,
    sBlock,
    sClock
  }
})
export default class Home extends Vue {
  // 头部标题参数
  private header = '智能水肥控制系统';
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  background: url("~@/assets/image/home_background.49c292cf.jpg") no-repeat
    center;
  background-size: cover;
  // position: relative;
}
</style>
