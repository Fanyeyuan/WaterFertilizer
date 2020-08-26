<template>
  <div>
    <div class="tabs">
      <el-row type="flex" :gutter="2">
        <el-col class="tab" :span="6" v-for="(tab, index) in tabs" :key="index">
          <div
            class="content"
            :class="{ active: active === tab.id }"
            @click="onTabClick(tab)"
          >
            <span>{{ tab.title }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div v-if="active === 1">
        <s-real></s-real>
      </div>
      <div v-if="active === 2">
        <s-curve></s-curve>
      </div>
      <div v-if="active === 3">
        <s-forecast7></s-forecast7>
      </div>
      <div v-if="active === 4">
        <s-forecast15></s-forecast15>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tabs, TabPane } from 'element-ui'

import sReal from './weather/Real.vue'
import sCurve from './weather/Curve.vue'
import sForecast7 from './weather/Forecast7.vue'
import sForecast15 from './weather/Forecast15.vue'

Vue.use(Tabs)
Vue.use(TabPane)

@Component({
  components: {
    sReal,
    sCurve,
    sForecast7,
    sForecast15
  }
})
export default class Weather extends Vue {
  private tabs = [
    { id: 1, title: '气象数据' },
    { id: 2, title: '气象曲线' },
    { id: 3, title: '7天预报' },
    { id: 4, title: '15天预报' }
  ];

  private active = 1;

  private onTabClick (tab: any) {
    this.active = tab.id
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  width: 3rem;
  position: absolute;
  top: 0.05rem;
  right: 0.1rem;

  .tab {
    width: 5rem;
    text-align: center;
    cursor: pointer;
    .content {
      display: inline-block;
      padding: 0.05rem;
      font-size: 0.12rem;
    }
  }

  .active {
    color: #409eff;
    border-bottom: 0.02rem solid #409eff;
  }
}
.content {
  box-sizing: border-box;
  padding: 0.05rem;
  // height: 100%;
}
</style>
