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
import { Component, Vue } from 'vue-property-decorator'
import * as Bus from '@/utils/bus'
import { ResponedInterface } from './utils/types/type'
import { Message } from 'element-ui'

import { namespace } from 'vuex-class'

import {
  Device as FacDevice,
  FacType,
  Element,
  Relay
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
  @databaseModule.Action('saveDevice') saveDevice!: (param: any[]) => void;
  @databaseModule.State('Device') Device!: FacDevice[];
  @databaseModule.Action('saveFacType') saveFacType!: (param: any[]) => void;
  @databaseModule.State('FacType') FacType!: FacType[];
  @databaseModule.Action('saveElement') saveElement!: (param: any[]) => void;
  @databaseModule.State('Element') Element!: Element[];
  @databaseModule.Action('saveFer') saveFer!: (param: any[]) => void;
  @databaseModule.Action('saveGroup') saveGroup!: (param: any[]) => void;
  @databaseModule.Action('saveGroupDevice') saveGroupDevice!: (
    param: any[]
  ) => void;

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

  @otherModule.State('DeviceList') DeviceList!: deviceInterface[];
  @otherModule.Action('saveDeviceList') saveDeviceList!: (param: any[]) => void;

  private updateDeviceList () {
    const list = this.Device.map((item: FacDevice) => {
      return {
        id: item.id,
        creator_id: item.creator_id,
        fac_id: item.fac_id,
        create_time: item.create_time,
        remark: item.remark,
        fac_name: item.fac_name,
        fac_type: this.FacType.find((ele: FacType) => (ele.id = item.fac_type)),
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
    this.saveDeviceList(list)
  }

  private getSensor (
    num: string,
    names: string,
    maxNumber: number
  ): ChannelInfoInterface[] {
    const ele = num.split('/')
    const name = names.split('/')
    const sensor: ChannelInfoInterface[] = []
    for (let i = 0; i < maxNumber; i++) {
      const temp: ChannelInfoInterface = {
        name: name[i],
        ele: this.Element.find((item: Element) => item.indexs === ele[i]),
        status: 0
      }
      sensor.push(temp)
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
      const temp: RelayInfoInterface = {
        name: name[i],
        relay: this.Relay.find((item: Relay) => item.indexs === Number(ele[i])),
        status: 0
      }
      relay.push(temp)
    }
    return relay
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
        this.updateDeviceList()
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
