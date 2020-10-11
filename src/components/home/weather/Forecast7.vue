<template>
  <div class="weather">
    <!-- <img src="/icon/weather/W0.png" alt srcset /> -->
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col
        class="col-bg"
        :span="4"
        v-for="(item, index) in weather"
        :key="index"
      >
        <p class="header">
          <span>{{ item.date }}</span>
          <em>({{ item.week }})</em>
        </p>
        <el-image class="image" :src="getWeatherIcon(item.text_day)" lazy />
        <h6 class="temperature">{{ item.low }} ~ {{ item.high }}℃</h6>
        <p class="sun">{{ item.text_day }}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { lodash, LodashKeys } from '@/utils/lodash'
import axios, { AxiosInstance } from 'axios'

@Component
export default class Forecast7 extends Vue {
  private weather: any[] = [];
  private getWeatherInfo () {
    const info = lodash.get(LodashKeys.WeatherInfo)
    const baseurl = 'baidu-weather://api.map.baidu.com/weather/v1/' // 底层拦截 将baidu-weather 转换为https  解决跨域问题
    // console.log(info);
    axios
      .get(baseurl, {
        params: {
          district_id:
            info.code.area || info.code.city || info.code.province || 420115,
          // location: "武汉",
          data_type: 'all',
          ak: info.ak
        }
      })
      .then((res: any) => {
        if (res.status === 200 && res.data.status === 0) {
          this.weather = res.data.result.forecasts
        }
      })
      .catch(console.log)
  }

  private getWeatherIcon (weather: string) {
    const icon = lodash.filter(LodashKeys.WeatherIcon, weather)
    // console.log(icon, this.weather, weather);
    if (!!icon && !!icon[0]) {
      return `/icon/weather/W${icon[0][weather].day}.png`
    }
    // return `/icon/weather/W${icon[0][weather].day}.png`;
  }

  private mounted () {
    this.getWeatherInfo()
    setInterval(this.getWeatherInfo, 30 * 60 * 1000) // 三十分钟读取一次
  }
}
</script>

<style lang="scss" scoped>
.weather {
  width: 100%;

  .row-bg {
    .col-bg {
      height: 100%;
      text-align: center;
      // &:hover {
      //   background: rgba($color: #409eff, $alpha: 0.5);
      // }
      .header {
        width: 100%;
        span {
          font-size: 1em;
        }
        em {
          font-size: 0.7em;
        }
      }
      .image {
        // width: 50%;
      }
      .temperature {
        font-size: 0.8em;
      }
      .sun {
        // font-size: 0.12rem;
        font-weight: bold;
      }
    }
  }
}
</style>
