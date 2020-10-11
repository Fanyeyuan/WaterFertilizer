<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/group">Group</router-link> |
      <router-link to="/mapView">MapView</router-link> |
      <router-link to="/param">Param</router-link> |
      <router-link to="/setting">Setting</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <s-updater></s-updater>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as Bus from '@/utils/bus'
import { Message } from 'element-ui'

import sUpdater from '@/components/Updater.vue'
import {
  Device as FacDevice,
  FacType,
  Element,
  Relay,
  Group,
  GroupDevice,
  Crop,
  Fer,
  TurnRecord,
  TurnFer,
  TurnContent
} from '@/app/main/database/model'

import * as TurnLogic from '@/utils/logic'
import {
  DeviceInterface,
  TurnRecordInterface,
  TurnGroupContent,
  GroupInterface,
  TurnStateInterface,
  ResponedInterface,
  ChannelInfoInterface,
  RelayInfoInterface,
  TurnContentStateInterface,
  TurnGroupFer,
  RealApiInterface,
  RealValueInterface,
  DisplayRealInterface
} from './utils/types/type'

import { namespace } from 'vuex-class'
const databaseModule = namespace('database')
const otherModule = namespace('other')

@Component({
  components: {
    sUpdater
  }
})
export default class App extends Vue {
  @databaseModule.Action('saveApiLog') saveApiLog!: (param: any[]) => void;
  @databaseModule.Action('saveControlLog') saveControlLog!: (
    param: any[]
  ) => void;

  @databaseModule.Action('saveCrop') saveCrop!: (param: any[]) => void;
  @databaseModule.State('Crop') Crop!: Crop[];
  @databaseModule.Action('saveDevice') saveDevice!: (param: any[]) => void;
  @databaseModule.State('Device') Device!: FacDevice[];
  @databaseModule.Action('saveFacType') saveFacType!: (param: any[]) => void;
  @databaseModule.State('FacType') FacType!: FacType[];
  @databaseModule.Action('saveElement') saveElement!: (param: any[]) => void;
  @databaseModule.State('Element') Element!: Element[];
  @databaseModule.Action('saveFer') saveFer!: (param: any[]) => void;
  @databaseModule.State('Fer') ferType!: Fer[];
  @databaseModule.Action('saveGroup') saveGroup!: (param: any[]) => void;
  @databaseModule.State('Group') Group!: Group[];
  @databaseModule.Action('saveGroupDevice') saveGroupDevice!: (
    param: any[]
  ) => void;

  @databaseModule.State('GroupDevice') GroupDevice!: GroupDevice[];

  @databaseModule.State('Reals') Reals!: RealApiInterface[];
  @databaseModule.Action('saveReals') saveReals!: (param: any[]) => void;
  @databaseModule.Action('saveRelay') saveRelay!: (param: any[]) => void;
  @databaseModule.State('Relay') Relay!: Relay[];
  @databaseModule.Action('saveTurnContent') saveTurnContent!: (
    param: any[]
  ) => void;

  @databaseModule.Action('saveTurnFer') saveTurnFer!: (param: any[]) => void;
  @databaseModule.Action('saveTurnRecord') saveTurnRecord!: (
    param: any[]
  ) => void;

  @databaseModule.State('TurnRecord') private TurnRecord!: TurnRecord[];
  @databaseModule.State('TurnContent') private TurnContent!: TurnContent[];
  @databaseModule.State('TurnFer') private TurnFer!: TurnFer[];

  @otherModule.State('DisplayReals') reals!: DisplayRealInterface[];
  @otherModule.Action('saveDisplayReals') saveDisplayReals!: (
    param: any[]
  ) => void;

  @otherModule.State('DeviceList') DeviceList!: DeviceInterface[];
  @otherModule.Action('saveDeviceList') saveDeviceList!: (param: any[]) => void;
  @otherModule.State('GroupList') GroupList!: GroupInterface[];
  @otherModule.Action('saveGroupList') saveGroupList!: (param: any[]) => void;
  @otherModule.State('TurnInfo') TurnInfo!: TurnRecordInterface[];
  @otherModule.Action('saveTurnInfo') private saveTurnInfo!: (
    param: any[]
  ) => void;

  private getSensor (
    num: string,
    names: string,
    maxNumber: number
  ): ChannelInfoInterface[] {
    const ele = num.split('/')
    const name = names.split('/')
    const sensor: ChannelInfoInterface[] = []
    for (let i = 0; i < maxNumber; i++) {
      // if (!!ele[i] && ele[i] !== "100") {
      const temp: ChannelInfoInterface = {
        index: i,
        name: name[i],
        // eslint-disable-line
        ele: this.Element.find((item: Element) => item.indexs === ele[i]),
        status: 0
      }
      sensor.push(temp)
      // }
    }
    // console.log(sensor);
    return sensor
  }

  private getRelay (
    num?: string,
    names?: string,
    maxNumber?: number
  ): RelayInfoInterface[] {
    const relay: RelayInfoInterface[] = []
    if (num !== undefined && names !== undefined && maxNumber !== undefined) {
      const ele = num.split('/')
      const name = names.split('/')
      for (let i = 0; i < maxNumber; i++) {
        // if (!!ele[i] && ele[i] !== "0") {
        const temp: RelayInfoInterface = {
          index: i,
          name: name[i],
          relay: this.Relay.find(
            (item: Relay) => item.indexs === Number(ele[i])
          ),
          status: 0
        }
        relay.push(temp)
        // }
      }
    }
    // console.log(num, names, relay);
    return relay
  }

  private getCurrentDeviceReal (dev: DeviceInterface): DisplayRealInterface {
    const real: RealApiInterface | undefined = this.Reals.find(
      (real: RealApiInterface) => real.id === dev.fac_id
    )
    const sensors: RealValueInterface[] = []
    dev.sensor.forEach((sensor: ChannelInfoInterface) => {
      if (sensor.ele.indexs !== '100') {
        let value = '------'
        if (real) {
          const data = sensor.ele.prec.toString().split('.')
          const point = data[1] ? data[1].length : 0
          value =
            real.sensor[sensor.index] === 32767 ||
            real.sensor[sensor.index] === 0x7fffffff
              ? '------'
              : (real.sensor[sensor.index] * sensor.ele.prec).toFixed(point)
        }
        sensors.push({
          index: sensor.index,
          name: sensor.name === '-' ? sensor.ele.name : sensor.name,
          value: value,
          unit: sensor.ele.unit
        })
      }
    })
    const relays: RealValueInterface[] = []
    dev.relay.map((relay: RelayInfoInterface) => {
      if (relay.relay.indexs !== 0) {
        relays.push({
          index: relay.index,
          name: relay.name === '-' ? relay.relay.name : relay.name,
          value: real ? real.relay[relay.index] : 0
        })
      }
    })
    return {
      id: dev.fac_id,
      name: dev.fac_name,
      sensor: sensors,
      relay: relays
    }
  }

  private get getDisplayReals () {
    if (!this.DeviceList.length || !this.Reals.length) return [] // 如果Devicelist 或者Reals 长度不够则 返回空数组
    let reals: DisplayRealInterface[] = []
    const expDevice = this.DeviceList.filter(
      (value: DeviceInterface) => value.fac_id >= 10000000000
    ) // 查询扩展设备
    const baseDevice = this.DeviceList.filter(
      (value: DeviceInterface) => value.fac_id < 10000000000
    ) // 查询基础设备
    const devices: DeviceInterface[] = [] // 处理过后的 devicelist
    if (expDevice.length > 0) {
      expDevice.sort(
        (a: DeviceInterface, b: DeviceInterface) => a.fac_id - b.fac_id
      ) // 设备编号升序排列
      baseDevice.forEach((value: DeviceInterface) => {
        const theExpDevice = expDevice.filter((exp: DeviceInterface) => {
          const id = Math.floor(exp.fac_id / 1000)
          return id === value.fac_id
        })
        const baseDeviceReal = this.getCurrentDeviceReal(value)
        if (theExpDevice.length > 0) {
          const theExpReals = theExpDevice.map(this.getCurrentDeviceReal)
          theExpReals.forEach((value: DisplayRealInterface) => {
            value = JSON.parse(JSON.stringify(value))
            value.sensor.forEach((sensor: RealValueInterface) => {
              sensor.index += (value.id % 1000) * 16
              baseDeviceReal.sensor.push(sensor)
            })
            value.relay.forEach((relay: RealValueInterface) => {
              relay.index += (value.id % 1000) * 16
              baseDeviceReal.relay.push(relay)
            })
          })
        }
        reals.push(baseDeviceReal)
      })
    } else {
      reals = baseDevice.map(this.getCurrentDeviceReal)
    }
    // console.log(reals);
    return reals
  }

  @Watch('getDisplayReals')
  private saveDisplayReal (value: DisplayRealInterface[]) {
    this.saveDisplayReals(value)
    TurnLogic.evalDeviceRealData(value)
  }

  // 存储设备列表
  private get getDeviceList () {
    if (
      !this.Device.length ||
      !this.FacType.length ||
      !this.Element.length ||
      !this.Relay.length
    ) { return [] } // Device FacType Element Relay 未加载 返回空数组
    return this.Device.map((item: FacDevice) => {
      return {
        id: item.id,
        creator_id: item.creator_id,
        fac_id: item.fac_id,
        create_time: item.create_time,
        remark: item.remark,
        fac_name: item.fac_name,
        fac_type: this.FacType.find((ele: FacType) => ele.id === item.fac_type),
        sensor: this.getSensor(item.ele_num, item.ele_name, 16),
        relay: this.getRelay(item.relay_num, item.relay_name, 32),
        relay_extend: item.relay_extend,
        relay_extend_count: item.relay_extend_count,
        exRelay: this.getRelay(
          item.relay_extend_num,
          item.relay_extend_name,
          item.relay_extend_count
        ),
        longitude: item.longitude,
        latitude: item.latitude,
        read_interval: item.read_interval
      }
    })
  }

  @Watch('getDeviceList')
  private saveDeviceLists (value: DeviceInterface[]) {
    // console.log(value);
    this.saveDeviceList(value)
  }

  // 存储灌区列表
  private get getGroupList () {
    if (
      !this.GroupDevice.length ||
      !this.DeviceList.length ||
      !this.Group.length ||
      !this.Crop.length
    ) {
      return []
    }
    const getGroupDevice = (groupId: number) => {
      const groupDeviceList = this.GroupDevice.filter(
        (item: GroupDevice) => item.group_id === groupId
      )

      return groupDeviceList.map((item: GroupDevice) => {
        const device = this.DeviceList.find(
          (device: DeviceInterface) => device.fac_id === item.fac_id
        )
        return {
          id: item.id,
          facId: item.fac_id,
          facName: item.name || device.fac_name,
          exp: item.exp,
          group: item,
          device
        }
      })
    }
    const getGroupMachine = (machineId: number) => {
      const machine = this.DeviceList.find(
        (device: DeviceInterface) => device.fac_id === machineId
      )
      return {
        facName: machine.fac_name,
        facId: machine.fac_id,
        device: machine,
        exp: null
      }
    }
    return this.Group.map((item: Group) => {
      return {
        id: item.id,
        userId: item.user_id,
        name: item.name,
        createTime: item.create_time,
        crop: this.Crop.find((crop: Crop) => crop.id === item.crop_id),
        machine: this.DeviceList.find(
          (device: DeviceInterface) => device.fac_id === item.machine_id
        ),
        device: getGroupDevice(item.id)
      }
    })
  }

  @Watch('getGroupList')
  private saveGroupLists (group: any) {
    this.saveGroupList(group)
  }

  private getScheduledTime (param: TurnRecordInterface) {
    let time = param.startTime
    param.group.forEach((item: any) => {
      // time += (item.runTime + item.delay) * 1000; //调试模式
      time += (item.runTime + item.delay) * 60 * 1000
    })
    return time
  }

  private get getParams () {
    if (
      !this.TurnRecord.length ||
      !this.TurnFer.length ||
      !this.Group.length ||
      !this.TurnContent.length ||
      !this.ferType.length
    ) { return [] } // TurnRecord TurnFer Group TurnContent ferType 未加载完成 返回空数组
    const params = this.TurnRecord.map((recode: TurnRecord) => {
      const content = this.TurnContent.filter(
        (content: TurnContent) => recode.id === content.turn_record_id
      )
      const Fer: TurnGroupFer[] = this.TurnFer.map((fer: TurnFer) => {
        return {
          id: fer.id,
          ferType: this.ferType.find(
            (ferType: Fer) => ferType.id === fer.fer_id
          ),
          ferRatio: fer.fer_ratio,
          ferWeight: fer.fer_weight,
          ferTime: fer.fer_time
        }
      })

      const param: TurnRecordInterface = {
        id: recode.id,
        startTime: recode.start_time,
        endTime: 0,
        userId: recode.user_id,
        name: recode.name,
        createTime: recode.create_time,
        state: recode.state,
        group: content.map((content: TurnContent) => {
          return {
            id: content.id,
            recordId: content.turn_record_id,
            group: this.Group.find(
              (group: Group) => group.id === content.group_id
            ),
            delay: content.delay,
            runTime: content.run_time,
            sequence: content.sequence,
            type: content.irrigation_type,
            fer: Fer.filter(
              (fer: TurnGroupFer) =>
                fer.id === content.fer1 ||
                fer.id === content.fer2 ||
                fer.id === content.fer3 ||
                fer.id === content.fer4
            )
          }
        })
      }
      param.endTime = this.getScheduledTime(param)
      return param
    })
    return params
  }

  @Watch('getParams', { immediate: true, deep: true })
  private saveTurnInfos (value: any) {
    this.saveTurnInfo(value)
  }

  // 监听 轮灌参数列表 灌区列表 设备列表
  @Watch('DeviceList', { immediate: true, deep: true })
  private evalDeviceList (list: DeviceInterface[]) {
    TurnLogic.evalDeviceList(list)
  }

  @Watch('GroupList', { immediate: true, deep: true })
  private evalGroupList (list: GroupInterface[]) {
    TurnLogic.evalGroupList(list)
  }

  @Watch('TurnInfo', { immediate: true, deep: true })
  private evalRecordList (list: TurnRecordInterface[]) {
    TurnLogic.evalRecordList(list)
  }

  private getReals () {
    Bus.getReals().then((res: ResponedInterface) => {
      if (res.state === 0) {
        console.log(res.data)
        this.saveReals(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
  }

  private mounted () {
    // Bus.checkUpdate().then(console.log).catch(console.log)
    TurnLogic.irrigationRun()
    this.getReals()
    setInterval(this.getReals, 10 * 1000)
    Bus.getDevice().then((res: ResponedInterface) => {
      if (res.state === 0) {
        // console.log(res);
        this.saveDevice(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getGroup().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveGroup(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getGroupDevice().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveGroupDevice(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getElement().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveElement(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getFacType().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveFacType(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getFer().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveFer(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getCrop().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveCrop(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getControlLog().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveControlLog(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getRelayType().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveRelay(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getTurnRecord().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveTurnRecord(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getTurnFer().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveTurnFer(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getTurnContent().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveTurnContent(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;
  color: white;
}

* {
  margin: 0;
  padding: 0;
  user-select: none;
}

a {
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

body {
  height: 100vh;
  font-size: 16px;
  // overflow: hidden;
}
</style>
