<template>
  <div class="home">
    <s-header class="header" :header="header"></s-header>
    <div class="body">
      <s-block class="datetime" :width="2.6" title="时间日期">
        <s-clock></s-clock>
      </s-block>
      <!-- <s-block class="moisture" :width="2.6" :height="4" title="墒情">
        <keep-alive>
          <s-moisture></s-moisture>
        </keep-alive>
      </s-block> -->
      <s-block class="weather" :width="7.6" :height="1.6" title="气象信息">
        <s-weather></s-weather>
      </s-block>
      <s-block
        class="topological"
        :width="7.6"
        :height="5.6"
        title="水肥拓扑图"
      >
        <s-topological></s-topological>
      </s-block>
      <s-block class="farming" :width="2.6" :height="4" title="农事待办">
        <keep-alive>
          <s-turn-irri></s-turn-irri>
        </keep-alive>
      </s-block>
      <s-block class="entry" :width="2.6" :height="1.6" title="入口">
        <ul>
          <router-link tag="li" to="/back/mapView">GIS</router-link>
          <router-link tag="li" to="/back/group">分组管理</router-link>
          <router-link tag="li" to="/back/param">农事参数</router-link>
          <router-link tag="li" to="/back/about">
            <el-badge :is-dot="hasNewVersion" class="item">关于</el-badge>
          </router-link>
        </ul>
      </s-block>
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
import axios, { AxiosInstance } from 'axios'
import { namespace } from 'vuex-class'

import sHeader from '@/components/home/Header.vue'
import sBlock from '@/components/home/Block.vue'
import sClock from '@/components/clock/Index.vue'
import sMoisture from '@/components/home/Moisture.vue'
import sWeather from '@/components/home/Weather.vue'
import sTurnIrri from '@/components/home/TurnIrri.vue'
import sTopological from '@/components/home/Topological.vue'

import * as Bus from '@/utils/bus'
import { lodash, LodashKeys } from '@/utils/lodash'
import { DeviceStationInfoInterface } from '@/utils/types/type'
import { Message, Badge } from 'element-ui'
const pageModule = namespace('page')
const versionModule = namespace('version')
Vue.use(Badge)

@Component({
  components: {
    sHeader,
    sBlock,
    sMoisture,
    sWeather,
    sTurnIrri,
    sClock,
    sTopological
  }
})
export default class Home extends Vue {
  // @pageModule.State("weather") private Weather!: { real: any[]; history: any[] };
  @pageModule.Action('saveWeather') saveWeather!: (param: any) => void;
  // @pageModule.State("moisture") private Moisture!: {real: any[];history: any[];};
  @pageModule.Action('saveMoisture') saveMoisture!: (param: any) => void;
  @versionModule.Getter('getHasNewVersion') private hasNewVersion!: boolean;

  // 头部标题参数
  private header = '智慧补墒衡养监控平台';

  private async getDeviceData (
    http: AxiosInstance,
    facId: number,
    pageSize = 50
  ) {
    try {
      const deviceData = await http.get(`/intfa/queryData/${facId}`)
      const deviceDatas = await http.get(`/datas/${facId}`, {
        params: {
          pageNum: 1,
          pageSize: pageSize
        }
      })

      const result: { real: any[]; history: any[] } = {
        real: deviceData.data.entity,
        history: deviceDatas.data
      }

      return result
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private async getData () {
    const info: any = lodash.get(LodashKeys.DeviceStationInfo)
    const iotAxios = axios.create({
      baseURL: 'http://47.105.215.208:8005/'
    })
    iotAxios.interceptors.response.use((res: any) => {
      if (res.status === 200) {
        return res
      } else {
        return Promise.reject(res)
      }
    })
    const iot = await iotAxios.post('/login', {
      username: info.username,
      password: info.password
    })

    iotAxios.defaults.headers.common.token = iot.data.token
    const weather = await this.getDeviceData(iotAxios, info.weatherFacId)
    const solid = await this.getDeviceData(iotAxios, info.solidFacId)
    this.saveWeather(weather)
    this.saveMoisture(solid)
    setInterval(async () => {
      try {
        const weather = await this.getDeviceData(iotAxios, info.weatherFacId)
        this.saveWeather(weather)
        const solid = await this.getDeviceData(iotAxios, info.solidFacId)
        this.saveMoisture(solid)
        // console.log(weather, solid);
      } catch (error) {
        const iot = await iotAxios.post('/login', {
          username: info.username,
          password: info.password
        })

        iotAxios.defaults.headers.common.token = iot.data.token
      }
    }, 60 * 1000)
  }

  private mounted () {
    this.getData()
  }
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
      right: 0;
      top: 0;
    }
    .farming {
      position: absolute;
      left: 0;
      top: 1.6rem;
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
          .item {
            vertical-align: middle;
            line-height: 1em;
          }
        }
      }
    }
  }
}
</style>
