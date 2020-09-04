<template>
  <div class="other">
    <el-scrollbar class="scroolbar" :wrapStyle="{ margin: 0 }" :native="false">
      <!-- <el-backtop
      target=".page-component__scroll .el-scrollbar__wrap"
    ></el-backtop> -->
      <div>
        墒情设备:
        <el-input-number
          v-model="solidFacId"
          @change="onSolidFacIdChange"
          :controls="false"
          :min="16000000"
          :max="99000000"
        ></el-input-number>
      </div>
      <el-divider></el-divider>
      <div>
        气象设备:
        <el-select
          v-model="weatherFacId"
          placeholder="请选择"
          @change="onWeatherFacIdChange"
        >
          <el-option
            v-for="item in device"
            :key="item.fac_id"
            :label="item.fac_name"
            :value="item.fac_id"
          >
          </el-option>
        </el-select>
      </div>
      <el-divider></el-divider>
      <div>
        拓扑水肥机信息
        <el-select
          v-model="machineFacId"
          placeholder="请选择"
          @change="onMachineFacIdChange"
        >
          <el-option
            v-for="item in device"
            :key="item.fac_id"
            :label="item.fac_name"
            :value="item.fac_id"
          >
          </el-option>
        </el-select>
      </div>
      <el-divider></el-divider>
      <div>
        <p>气象信息</p>
        <el-input
          placeholder="请输入内容"
          type="password"
          v-model="weatherInfo.ak"
          @change="onWeatherAkChange"
        >
          <template slot="prepend">ak 码</template>
        </el-input>
        <el-input
          placeholder="请输入查询地经纬度,经度在前"
          v-model="weatherInfoLocation"
        >
          <template slot="prepend">经纬度</template>
        </el-input>
      </div>
      <el-divider></el-divider>
      <div>
        <p>地图信息</p>
        <el-input
          placeholder="请输入内容"
          type="password"
          v-model="mapInfo.ak"
          @change="onMapAkChange"
        >
          <template slot="prepend">ak 码</template>
        </el-input>
        <el-input
          placeholder="请输入查询地经纬度,经度在前"
          v-model="mapInfoLocation"
        >
          <template slot="prepend">经纬度</template>
        </el-input>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  Select,
  Option,
  Divider,
  InputNumber,
  Backtop,
  Input
} from 'element-ui'

import { lodash, LodashKeys } from '@/utils/lodash'
import { Device } from '@/app/main/database/model'
import { namespace } from 'vuex-class'
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Backtop)
Vue.use(Divider)
Vue.use(InputNumber)
const databaseModule = namespace('database')

@Component
export default class Other extends Vue {
  @databaseModule.State('Device') device!: Device[];

  private solidFacId = 16061101;
  private weatherFacId = 16061102;
  private machineFacId = 15112502;
  private weatherInfo = {
    ak: 'd0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5',
    location: { longitude: 114.31283, latitude: 30.598634 }
  };

  private mapInfo = {
    ak: 'd0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5',
    location: { longitude: 114.31283, latitude: 30.598634 }
  };

  private save (key: string, value: any) {
    lodash.set(key, value)
  }

  private onSolidFacIdChange () {
    this.save(LodashKeys.SolidFacId, this.solidFacId)
  }

  private onWeatherFacIdChange () {
    this.save(LodashKeys.WeatherStationFacId, this.weatherFacId)
  }

  private onWeatherAkChange () {
    this.save(LodashKeys.WeatherInfo, this.weatherInfo)
  }

  private onMachineFacIdChange () {
    this.save(LodashKeys.MachineFacId, this.machineFacId)
  }

  private get weatherInfoLocation () {
    return (
      this.weatherInfo.location.longitude +
      ',' +
      this.weatherInfo.location.latitude
    )
  }

  private set weatherInfoLocation (value: string) {
    const location = value.split(',')
    if (location.length === 0) {
      this.weatherInfo.location.longitude = Number(location[0])
    } else if (location.length > 1) {
      this.weatherInfo.location.longitude = Number(location[0])
      this.weatherInfo.location.latitude = Number(location[1])
    }
    this.save(LodashKeys.MapInfo, this.mapInfo)
  }

  private onMapAkChange () {
    this.save('map-info', this.mapInfo)
  }

  private get mapInfoLocation () {
    return (
      this.mapInfo.location.longitude + ',' + this.mapInfo.location.latitude
    )
  }

  private set mapInfoLocation (value: string) {
    const location = value.split(',')
    if (location.length === 0) {
      this.mapInfo.location.longitude = Number(location[0])
    } else if (location.length > 1) {
      this.mapInfo.location.longitude = Number(location[0])
      this.mapInfo.location.latitude = Number(location[1])
    }
    this.save('map-info', this.mapInfo)
  }
}
</script>

<style lang="scss" scoped>
.other {
  height: 100%;
  .scroolbar {
    height: 100%;
  }
}
</style>
