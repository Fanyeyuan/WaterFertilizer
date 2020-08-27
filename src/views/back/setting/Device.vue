<template>
  <div class="device">
    <el-table
      class="table"
      stripe
      :height="630"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      :data="deviceList"
    >
      <el-table-column prop="id" label="编号" width="50"> </el-table-column>
      <el-table-column prop="fac_id" label="设备ID" width="90">
      </el-table-column>
      <el-table-column prop="fac_name" label="设备名称" width="140">
      </el-table-column>
      <el-table-column label="设备类型" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.fac_type.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="100">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >基本配置</el-button
          >
          <el-button
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="opt">
      <el-button plain size="mini" type="primary" @click="onAddClick()"
        >添加</el-button
      >
      <el-button
        v-show="false"
        plain
        size="mini"
        type="primary"
        @click="onCloneClick()"
        >克隆</el-button
      >
    </div>
    <div v-if="visible">
      <new-device
        :visible.sync="visible"
        :device="info"
        :title="title"
        @edit-device-confirm="onEditDeviceConfirm"
      ></new-device>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import moment from 'moment'

import { namespace } from 'vuex-class'

import * as Bus from '@/utils/bus'
import { ResponedInterface } from './utils/types/type'

import {
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  InputNumber,
  Switch,
  Select,
  Option,
  Dialog,
  Scrollbar,
  Message,
  MessageBox
} from 'element-ui'

import {
  Device as FacDevice,
  FacType,
  Element,
  Relay
} from '@/app/main/database/model'
import NewDevice, {
  deviceInterface
} from '@/components/back/setting/NewDevice.vue'
import { ChannelInfoInterface } from '@/components/back/setting/ChannelInfo.vue'
import { RelayInfoInterface } from '@/components/back/setting/RelayInfo.vue'
const databaseModule = namespace('database')
const otherModule = namespace('other')

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Switch)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Scrollbar)

@Component({
  components: {
    NewDevice
  },
  filters: {
    dateFormat: (value: any, format: string) => {
      return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
    }
  }
})
export default class Device extends Vue {
  @databaseModule.Action('saveDevice') saveDevice!: (param: any[]) => void;
  @databaseModule.State('Device') Device!: FacDevice[];
  @databaseModule.State('FacType') FacType!: FacType[];
  @databaseModule.State('Element') Element!: Element[];
  @databaseModule.State('Relay') Relay!: Relay[];
  @otherModule.State('DeviceList') DeviceList!: deviceInterface[];
  @otherModule.Action('saveDeviceList') saveDeviceList!: (param: any[]) => void;

  private deviceList: deviceInterface[] = [];

  private title = '添加设备';
  private visible = false;
  private defaultInfo = {
    creator_id: 0, // eslint-disable-line
    create_time: new Date().getTime(), // eslint-disable-line
    read_interval: 1, // eslint-disable-line
    sensor: [],
    relay: [],
    exRelay: []
  };

  private info: deviceInterface | {} = this.defaultInfo;

  private handleEdit (index: number, row: deviceInterface) {
    this.info = row
    console.log(row)
    this.title = '修改设备'
    this.visible = true
  }

  private handleDelete (index: number, row: deviceInterface) {
    // this.deviceList.splice(index, 1);
    MessageBox.confirm('确定删除该设备吗?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const result = await Bus.deleteDeivce(row.fac_id)
      if (result.state === 0) {
        Message.success(result.msg)
        this.updateDeviceState()
      } else {
        Message.error(result.msg)
      }
    })
  }

  private onAddClick () {
    // console.log("onAddClick");
    this.title = '添加设备'
    this.visible = true
    this.info = JSON.parse(JSON.stringify(this.defaultInfo))
  }

  private onCloneClick () {
    this.title = '克隆设备'
    this.visible = true
  }

  private async onEditDeviceConfirm (value: deviceInterface) {
    const index = this.deviceList.findIndex(
      (item: any) => item.id === value.id
    )
    let result: ResponedInterface
    if (index > -1) {
      console.log(result, '1')
      // result = <ResponedInterface>await this.deviceList.splice(index, 1, value);
      result = await this.eidtDeviceToDB(value, true)
    } else {
      // value.id = this.deviceList[this.deviceList.length - 1].id + 1;
      // this.deviceList.push(value);
      result = await this.eidtDeviceToDB(value)
    }

    if (result.state !== 0) {
      Message.error(result.type + '-' + result.msg)
    } else {
      this.visible = false
      this.updateDeviceState()
      Message.success(result.type + '-' + result.msg)
    }
  }

  private eidtDeviceToDB (value: deviceInterface, isUpdate = false) {
    const device = new FacDevice()
    device.id = value.id
    device.creator_id = value.creator_id; // eslint-disable-line
    device.fac_id = value.fac_id; // eslint-disable-line
    device.create_time = value.create_time; // eslint-disable-line
    device.remark = value.remark
    device.fac_name = value.fac_name; // eslint-disable-line
    device.fac_type = value.fac_type.id; // eslint-disable-line

    let temp = []
    if (value.sensor.length) {
      temp = value.sensor.map(item => {
        return item.ele.indexs
      })
      device.ele_num = temp.join("/"); // eslint-disable-line
      temp = value.sensor.map(item => {
        return item.name
      })
      device.ele_name = temp.join("/"); // eslint-disable-line
    } else {
      device.ele_num =
        '100/100/100/100/100/100/100/100/100/100/100/100/100/100/100/100'
      device.ele_name = '-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-'
    }

    if (value.relay.length) {
      temp = value.relay.map(item => {
        return item.relay.indexs
      })
      device.relay_num = temp.join("/"); // eslint-disable-line
      temp = value.relay.map(item => {
        return item.name
      })
      device.relay_name = temp.join("/"); // eslint-disable-line
    } else {
      device.relay_num =
        '0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0'
      device.relay_name =
        '-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-'
    }

    device.longitude = value.longitude
    device.latitude = value.latitude
    device.read_interval = value.read_interval; // eslint-disable-line

    device.relay_extend = value.relay_extend; // eslint-disable-line
    device.relay_extend_count = value.relay_extend_count; // eslint-disable-line
    if (value.exRelay.length) {
      temp = value.exRelay.map(item => {
        return item.relay.indexs
      })
      device.relay_extend_num = temp.join("/"); // eslint-disable-line
      temp = value.exRelay.map(item => {
        return item.name
      })
      device.relay_extend_name = temp.join("/"); // eslint-disable-line
    } else {
      const num = new Array(value.relay_extend_count).fill(0)
      const name = new Array(value.relay_extend_count).fill('-')
      device.relay_extend_num = num.join('/')
      device.relay_extend_name = name.join('/')
    }

    if (isUpdate) {
      return Bus.updateDeivce(device)
    } else {
      return Bus.createDeivce(device)
    }
  }

  private updateDeviceState () {
    Bus.getDevice().then((res: ResponedInterface) => {
      if (res.state === 0) {
        this.saveDevice(res.data)
        this.updateDeviceList()
      } else {
        Message.warning(res.type + '-' + res.msg)
      }
    })
  }

  private updateDeviceList () {
    this.deviceList = this.Device.map((item: FacDevice) => {
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
    this.saveDeviceList(this.deviceList) // 更新 devicelist 状态
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
    this.updateDeviceList()
  }
}
</script>

<style lang="scss" scoped>
.device {
  // height: 100%;
  position: relative;
  .opt {
    padding-top: 0.1rem;
  }
  .create {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: white;
    z-index: 100;
  }
}
</style>
