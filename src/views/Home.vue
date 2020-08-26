<template>
  <div class="home">
    <s-header class="header" :header="header"></s-header>
    <div class="body">
      <s-block class="datetime" :width="2.6" title="时间日期">
        <s-clock></s-clock>
      </s-block>
      <s-block class="moisture" :width="2.6" :height="4" title="墒情">
        <s-moisture></s-moisture>
      </s-block>
      <s-block class="weather" :width="7.6" :height="1.6" title="气象信息">
        <s-weather></s-weather>
      </s-block>
      <s-block class="topological" :width="5" :height="5.6" title="水肥拓扑图">
        水肥拓扑图
      </s-block>
      <s-block class="farming" :width="2.6" :height="5.6" title="农事待办">
        农事待办
      </s-block>
      <s-block class="entry" :width="2.6" :height="1.6" title="入口">
        <ul>
          <router-link tag="li" to="/back/mapView">GIS</router-link>
          <router-link tag="li" to="/back/group">分组管理</router-link>
          <router-link tag="li" to="/back/param">农事参数</router-link>
          <router-link tag="li" to="/back/about">关于</router-link>
        </ul>
      </s-block>
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'

import sHeader from '@/components/home/Header.vue'
import sBlock from '@/components/home/Block.vue'
import sClock from '@/components/clock/Index.vue'
import sMoisture from '@/components/home/Moisture.vue'
import sWeather from '@/components/home/Weather.vue'

@Component({
  components: {
    sHeader,
    sBlock,
    sMoisture,
    sWeather,
    sClock
  }
})
export default class Home extends Vue {
  // 头部标题参数
  private header = '智惠水肥控制系统';
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  // padding: 0.45rem 0 0;
  background: url("~@/assets/image/home_background.49c292cf.jpg") no-repeat
    center;
  background-size: cover;
  box-sizing: border-box;

  .header {
    // margin: -0.45rem 0 0;
  }
  .body {
    position: relative;
    // margin: 0.1rem;
    height: calc(100% - 0.45rem);
    .datetime {
      position: absolute;
      top: 0;
      left: 0;
    }
    .moisture {
      position: absolute;
      left: 0;
      top: 1.6rem;
    }
    .weather {
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .topological {
      position: absolute;
      left: 2.6rem;
      top: 0;
    }
    .farming {
      position: absolute;
      right: 0;
      top: 0;
    }
    .entry {
      position: absolute;
      right: 0;
      bottom: 0;
      // display: flex;
      // justify-content: space-around;
      // flex-wrap: wrap;
      // margin: 0 auto;
      ul {
        padding: 0.1rem 0.17rem;
        li {
          display: inline-block;
          width: 1rem;
          height: 0.4rem;
          margin: 0.04rem;
          line-height: 0.4rem;
          text-align: center;
          cursor: pointer;
          color: #606266;
          background-color: rgb(198, 226, 255);
          border: 1px solid #909399;
          border-radius: 0.1rem;

          &:hover {
            color: #409eff;
            box-shadow: 0 0 5px rgba($color: #59b9a4, $alpha: 1);
          }
        }
      }
    }
  }
}
</style>
