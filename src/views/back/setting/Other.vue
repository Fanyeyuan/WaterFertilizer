<template>
  <div class="other">
    <el-scrollbar
      class="scroolbar"
      :wrapStyle="{ 'margin-bottom': 0 }"
      :native="false"
    >
      <!-- <el-backtop
      target=".page-component__scroll .el-scrollbar__wrap"
    ></el-backtop> -->
      <div>
        <el-row type="flex">
          <el-col>
            墒情设备:
            <el-input-number
              v-model="deviceStationInfo.solidFacId"
              @change="ondeviceStationInfoChange"
              :controls="false"
              :min="16000000"
              :max="99000000"
            ></el-input-number>
            <div>
              用户名:
              <el-input
                class="input"
                placeholder="请输入设备所在账户用户名"
                v-model="deviceStationInfo.username"
                @change="ondeviceStationInfoChange"
              >
                <!-- <template slot="prepend">用户名</template> -->
              </el-input>
            </div>
          </el-col>
          <el-col>
            气象设备:
            <el-input-number
              v-model="deviceStationInfo.weatherFacId"
              @change="ondeviceStationInfoChange"
              :controls="false"
              :min="16000000"
              :max="99000000"
            ></el-input-number>
            <div>
              密码:
              <el-input
                class="input"
                type="password"
                placeholder="请输入设备所在账户密码"
                v-model="deviceStationInfo.password"
                @change="ondeviceStationInfoChange"
              >
                <!-- <template slot="prepend">密码</template> -->
              </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="machineInfo">
        拓扑水肥机信息
        <el-select
          v-model="machineInfo.facId"
          placeholder="请选择"
          @change="onMachineInfoChange"
        >
          <el-option
            v-for="item in device"
            :key="item.fac_id"
            :label="item.fac_name"
            :value="item.fac_id"
          >
          </el-option>
        </el-select>
        <div class="Info">
          <div class="level">
            蓄水池深度
            <el-input-number
              placeholder="请输入蓄水池深度"
              v-model="machineInfo.poolLevel"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >mm
          </div>
          <div class="area">
            蓄水池 横截面积
            <el-input-number
              placeholder="请输入蓄水池 横截面积"
              v-model="machineInfo.poolArea"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >m2
          </div>
        </div>
        <div class="Info">
          <div class="level">
            肥料桶1深度
            <el-input-number
              placeholder="请输入肥料桶1深度"
              v-model="machineInfo.fer1Level"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >mm
          </div>
          <div class="area">
            肥料桶1 横截面积
            <el-input-number
              placeholder="请输入肥料桶1 横截面积"
              v-model="machineInfo.fer1Area"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >m2
          </div>
        </div>
        <div class="Info">
          <div class="level">
            肥料桶2深度
            <el-input-number
              placeholder="请输入肥料桶2深度"
              v-model="machineInfo.fer2Level"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >mm
          </div>
          <div class="area">
            肥料桶2 横截面积
            <el-input-number
              placeholder="请输入肥料桶2 横截面积"
              v-model="machineInfo.fer2Area"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >m2
          </div>
        </div>
        <div class="Info">
          <div class="level">
            肥料桶3深度
            <el-input-number
              placeholder="请输入肥料桶3深度"
              v-model="machineInfo.fer3Level"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >mm
          </div>
          <div class="area">
            肥料桶3 横截面积
            <el-input-number
              placeholder="请输入肥料桶3 横截面积"
              v-model="machineInfo.fer3Area"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >m2
          </div>
        </div>
        <div class="Info">
          <div class="level">
            肥料桶4深度
            <el-input-number
              placeholder="请输入肥料桶4深度"
              v-model="machineInfo.fer4Level"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >mm
          </div>
          <div class="area">
            肥料桶4 横截面积
            <el-input-number
              placeholder="请输入肥料桶4 横截面积"
              v-model="machineInfo.fer4Area"
              :controls="false"
              @change="onMachineInfoChange"
            >
            </el-input-number
            >m2
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div>
        <p>气象信息:</p>
        <el-input
          placeholder="请输入内容"
          type="password"
          v-model="weatherInfo.ak"
          @change="onWeatherAkChange"
        >
          <template slot="prepend">ak 码</template>
        </el-input>
        <span>城市区域:</span>
        <v-region
          v-model="weatherInfo.code"
          @values="onWeatherCodeChange"
        ></v-region>
        <!-- <el-input
          placeholder="请输入查询地经纬度,经度在前"
          v-model="weatherInfoLocation"
        >
          <template slot="prepend">经纬度</template>
        </el-input> -->
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
import vRegion from 'v-region'

import { lodash, LodashKeys } from '@/utils/lodash'
import { Device } from '@/app/main/database/model'
import { namespace } from 'vuex-class'
Vue.use(vRegion)
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
  private deviceStationInfo = lodash.get(LodashKeys.DeviceStationInfo) || {
    solidFacId: 16067318,
    weatherFacId: 16067285,
    username: '3594446',
    password: '123456'
  };

  private machineInfo = lodash.get(LodashKeys.MachineInfo) || {
    facId: 15112502,
    poolLevel: 1000,
    poolArea: 40000, // 蓄水池  横截面积 单位 平方毫米
    fer1Level: 500,
    fer1Area: 10000, // 肥料桶1  横截面积
    fer2Level: 500,
    fer2Area: 10000, // 肥料桶2  横截面积
    fer3Level: 500,
    fer3Area: 10000, // 肥料桶3  横截面积
    fer4Level: 500,
    fer4Area: 10000 // 肥料桶4  横截面积
  };

  private weatherInfo = lodash.get(LodashKeys.WeatherInfo) || {
    ak: 'd0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5',
    code: {},
    location: { longitude: 114.31283, latitude: 30.598634 }
  };

  private mapInfo = lodash.get(LodashKeys.MapInfo) || {
    ak: 'd0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5',
    location: { longitude: 114.31283, latitude: 30.598634 }
  };
  // private deviceStationInfo = {
  //   solidFacId: 16067318,
  //   weatherFacId: 16067285,
  //   username: "3594446",
  //   password: "123456"
  // };
  // private machineFacId = 15112502;
  // private weatherInfo = {
  //   ak: "d0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5",
  //   code: {},
  //   location: { longitude: 114.31283, latitude: 30.598634 }
  // };

  // private mapInfo = {
  //   ak: "d0w5OfcpnMrjyHTwDqUV4rGnQkGirwo5",
  //   location: { longitude: 114.31283, latitude: 30.598634 }
  // };

  private save (key: string, value: any) {
    lodash.set(key, value)
  }

  private ondeviceStationInfoChange () {
    this.save(LodashKeys.DeviceStationInfo, this.deviceStationInfo)
  }

  private onWeatherAkChange () {
    this.save(LodashKeys.WeatherInfo, this.weatherInfo)
  }

  private onWeatherCodeChange (value: any) {
    // console.log(this.weatherInfo, value);
    this.save(LodashKeys.WeatherInfo, this.weatherInfo)
  }

  private onMachineInfoChange () {
    this.save(LodashKeys.MachineInfo, this.machineInfo)
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
    this.save(LodashKeys.MapInfo, this.mapInfo)
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
    this.save(LodashKeys.MapInfo, this.mapInfo)
  }
}
</script>

<style lang="scss">
.other {
  height: 100%;
  .scroolbar {
    height: 6.5rem;

    .machineInfo {
      .Info {
        display: flex;
        justify-content: space-around;
        .level {
        }
      }
    }

    .el-scrollbar__wrap {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }

    .input {
      width: 80%;
    }
  }
}
</style>
