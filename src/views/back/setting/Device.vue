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
        @edit-device-confirm="onEditDeviceConfirm"
      ></new-device>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import moment from 'moment'

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
  Scrollbar
} from 'element-ui'

import { Device as FacDevice, FacType } from '@/app/main/database/model'
import NewDevice, {
  deviceInterface
} from '@/components/back/setting/NewDevice.vue'

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
  private deviceList: deviceInterface[] = [
    {
      id: 1,
      fac_name: "设备16061101", // eslint-disable-line
      fac_type: {
        // eslint-disable-line
        id: 1,
        name: '气象站'
      },
      remark: '2020/08/24 15:31:25',
      creator_id: 0, // eslint-disable-line
      fac_id: 16061101, // eslint-disable-line
      create_time: new Date().getTime(), // eslint-disable-line
      longitude: 138.1111,
      latitude: 30.34234,
      read_interval: 1, // eslint-disable-line
      sensor: [
        {
          name: '-',
          ele: {
            id: 6,
            indexs: '102',
            name: '大气湿度',
            unit: '%RH',
            min: 0,
            max: 100,
            prec: 0.1
          }
        },
        {
          name: '-',
          ele: {
            id: 7,
            indexs: '103',
            name: '模拟气压',
            unit: 'hPa',
            min: 500,
            max: 1500,
            prec: 0.1
          }
        }
      ],
      relay: [
        {
          name: '-',
          relay: {
            id: 1,
            indexs: 1,
            name: '风机'
          }
        },
        {
          name: '-',
          relay: {
            id: 2,
            indexs: 2,
            name: '水泵'
          }
        }
      ]
    },
    {
      id: 2,
      fac_name: "设备16061102", // eslint-disable-line
      // eslint-disable-line
      fac_type: {
        id: 1,
        name: '气象站'
      },
      remark: '2020/08/24 15:31:25',
      creator_id: 0, // eslint-disable-line
      fac_id: 16061102, // eslint-disable-line
      create_time: new Date().getTime(), // eslint-disable-line
      longitude: 138.1111,
      latitude: 30.34234,
      read_interval: 1, // eslint-disable-line
      sensor: [
        {
          name: '-',
          ele: {
            id: 6,
            indexs: '102',
            name: '大气湿度',
            unit: '%RH',
            min: 0,
            max: 100,
            prec: 0.1
          }
        },
        {
          name: '-',
          ele: {
            id: 7,
            indexs: '103',
            name: '模拟气压',
            unit: 'hPa',
            min: 500,
            max: 1500,
            prec: 0.1
          }
        }
      ],
      relay: [
        {
          name: '-',
          relay: {
            id: 1,
            indexs: 1,
            name: '风机'
          }
        },
        {
          name: '-',
          relay: {
            id: 2,
            indexs: 2,
            name: '水泵'
          }
        }
      ]
    }
  ];

  private visible = false;
  private defaultInfo = {
    creator_id: 0, // eslint-disable-line
    create_time: new Date().getTime(), // eslint-disable-line
    read_interval: 1, // eslint-disable-line
    sensor: [],
    relay: []
  };

  private info: deviceInterface | {} = this.defaultInfo;

  private handleEdit (index: number, row: deviceInterface) {
    this.info = row
    console.log(row)
    this.visible = true
  }

  private handleDelete (index: number) {
    this.deviceList.splice(index, 1)
  }

  private onAddClick () {
    // console.log("onAddClick");
    this.visible = true
    this.info = JSON.parse(JSON.stringify(this.defaultInfo))
  }

  private onCloneClick () {
    this.visible = true
  }

  private onEditDeviceConfirm (value: deviceInterface) {
    const index = this.deviceList.findIndex(
      (item: any) => item.id === value.id
    )
    if (index > -1) {
      this.deviceList.splice(index, 1, value)
    } else {
      value.id = this.deviceList[this.deviceList.length - 1].id + 1
      this.deviceList.push(value)
      // this.$bus.getReals().then(console.log);
      // let result = JSON.parse(JSON.stringify(value));
      // console.log(this.deviceList, value);
      this.createNewDeviceToDB(value)
    }
    this.visible = false
  }

  private createNewDeviceToDB (value: deviceInterface) {
    const device = new FacDevice()
    device.id = value.id
    device.creator_id = value.creator_id; // eslint-disable-line
    device.fac_id = value.fac_id; // eslint-disable-line
    device.create_time = value.create_time; // eslint-disable-line
    device.remark = value.remark
    device.fac_name = value.fac_name; // eslint-disable-line
    device.fac_type = value.fac_type.id; // eslint-disable-line

    let temp = []
    temp = value.sensor.map(item => {
      return item.ele.indexs
    })
    console.log(temp)
    device.ele_num = temp.join("/"); // eslint-disable-line
    temp = value.sensor.map(item => {
      return item.name
    })
    device.ele_name = temp.join("/"); // eslint-disable-line

    temp = value.relay.map(item => {
      return item.relay.indexs
    })
    device.relay_num = temp.join("/"); // eslint-disable-line
    temp = value.relay.map(item => {
      return item.name
    })
    device.relay_name = temp.join("/"); // eslint-disable-line

    device.longitude = value.longitude
    device.latitude = value.latitude
    device.read_interval = value.read_interval; // eslint-disable-line

    device.relay_extend = value.relay_extend; // eslint-disable-line
    device.relay_extend_count = value.relay_extend_count; // eslint-disable-line
    temp = value.relay.map(item => {
      return item.relay.indexs
    })
    device.relay_extend_num = temp.join("/"); // eslint-disable-line
    temp = value.relay.map(item => {
      return item.name
    })
    device.relay_extend_name = temp.join("/"); // eslint-disable-line
    this.$bus.createDeivce(device).then(console.log)
  }

  private mounted () {
    // this.$bus.getDevice().then(res => {
    //   console.log(res);
    //   if (!!res.data) {
    //     // this.deviceList = res.data.map(device => {
    //     //   let result = JSON.parse(JSON.stringify(device));
    //     //   // result.
    //     // });
    //   }
    // });
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
