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
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as Bus from '@/utils/bus'
import { ResponedInterface } from './utils/types/type'
import { Message } from 'element-ui'

import { namespace } from 'vuex-class'

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
import { deviceInterface } from '@/components/back/setting/NewDevice.vue'
import { ChannelInfoInterface } from '@/components/back/setting/ChannelInfo.vue'
import { RelayInfoInterface } from '@/components/back/setting/RelayInfo.vue'
const databaseModule = namespace('database')
const otherModule = namespace('other')

@Component
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

  @databaseModule.State('TurnRecord') private TurnRecord: TurnRecord[];
  @databaseModule.State('TurnContent') private TurnContent: TurnContent[];
  @databaseModule.State('TurnFer') private TurnFer: TurnFer[];

  @otherModule.State('DeviceList') DeviceList!: deviceInterface[];
  @otherModule.Action('saveDeviceList') saveDeviceList!: (param: any[]) => void;
  @otherModule.Action('saveGroupList') saveGroupList!: (param: any[]) => void;
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
      if (ele[i] !== '100') {
        const temp: ChannelInfoInterface = {
          name: name[i],
          ele: this.Element.find((item: Element) => item.indexs === ele[i]),
          status: 0
        }
        sensor.push(temp)
      }
    }
    return sensor
  }

  private getRelay (
    num: string,
    names: string,
    maxNumber: number
  ): RelayInfoInterface[] {
    const ele = num.split('/')
    const name = names.split('/')
    const relay: RelayInfoInterface[] = []
    for (let i = 0; i < maxNumber; i++) {
      if (ele[i] !== '0') {
        const temp: RelayInfoInterface = {
          index: i,
          name: name[i],
          relay: this.Relay.find(
            (item: Relay) => item.indexs === Number(ele[i])
          ),
          status: 0
        }
        relay.push(temp)
      }
    }
    return relay
  }

  // 存储设备列表
  private get getDeviceList () {
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
  private saveDeviceLists (value: any[]) {
    this.saveDeviceList(value)
  }

  // 存储灌区列表
  private get getGroupList () {
    const getGroupDevice = (groupId: number) => {
      const groupDeviceList = this.GroupDevice.filter(
        (item: GroupDevice) => item.group_id === groupId
      )

      return groupDeviceList.map((item: GroupDevice) => {
        const device = this.DeviceList.find(
          (device: deviceInterface) => device.fac_id === item.fac_id
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
        (device: FacDevice) => device.fac_id === machineId
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
          (device: FacDevice) => device.fac_id === item.machine_id
        ),
        device: getGroupDevice(item.id)
      }
    })
  }

  @Watch('getGroupList')
  private saveGroupLists (group: any) {
    // console.log(group);
    this.saveGroupList(group)
  }

  private get getParams () {
    const params = this.TurnRecord.map((recode: TurnRecord) => {
      const content = this.TurnContent.filter(
        (content: TurnContent) => recode.id === content.turn_record_id
      )
      const Fer = this.TurnFer.map((fer: TurnFer) => {
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

      return {
        id: recode.id,
        startTime: recode.start_time,
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
              (fer: TurnFer) =>
                fer.id === content.fer1 ||
                fer.id === content.fer2 ||
                fer.id === content.fer3 ||
                fer.id === content.fer4
            )
          }
        })
      }
    })
    return params
  }

  @Watch('getParams', { immediate: true, deep: true })
  private saveTurnInfos (value: any) {
    this.saveTurnInfo(value)
  }

  private mounted () {
    Bus.getReals().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveReals(res.data)
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
    Bus.getDevice().then((res: ResponedInterface) => {
      if (res.state === 0) {
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
