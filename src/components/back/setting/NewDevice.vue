<template>
  <el-dialog
    :title="title"
    width="90%"
    :center="true"
    :lock-scroll="true"
    top="5vh"
    custom-class="dialog"
    :visible.sync="flag"
    :show-close="false"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-row type="flex">
      <el-col :span="6">
        <device-info :info="info" :device-types="deviceTypes"></device-info>
      </el-col>
      <el-col :offset="1" :span="17">
        <el-scrollbar class="scroolbar">
          <channel-info v-model="info.sensor"></channel-info>
          <el-row type="flex">
            <relay-info v-model="info.relay"></relay-info>
            <relay-info
              v-model="info.exRelay"
              :relay-start-number="33"
              :relay-number="info.relay_extend_count"
              v-if="info.relay_extend"
            ></relay-info>
          </el-row>
        </el-scrollbar>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onConfirm">确 定</el-button>
      <el-button type="danger" @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Watch,
  Emit
} from 'vue-property-decorator'
import { Device, FacType } from '@/app/main/database/model'
import { MessageBox, Message } from 'element-ui'

import { namespace } from 'vuex-class'

import DeviceInfo from './DeviceInfo.vue'
import ChannelInfo, { ChannelInfoInterface } from './ChannelInfo.vue'
import RelayInfo, { RelayInfoInterface } from './RelayInfo.vue'
const databaseModule = namespace('database')

export interface DeviceInterface {
  id?: number;
  creator_id: number;
  fac_id: number; // eslint-disable-line
  create_time: number; // eslint-disable-line
  remark: string; // eslint-disable-line
  fac_name: string; // eslint-disable-line
  fac_type: FacType; // eslint-disable-line
  sensor: ChannelInfoInterface[];
  relay: RelayInfoInterface[];
  relay_extend: boolean; // eslint-disable-line
  relay_extend_count: 16; // eslint-disable-line
  exRelay: RelayInfoInterface[];
  longitude: number;
  latitude: number;
  read_interval: number; // eslint-disable-line
}

@Component({
  components: {
    DeviceInfo,
    ChannelInfo,
    RelayInfo
  }
})
export default class NewDevice extends Vue {
  @databaseModule.State('FacType') private deviceTypes!: FacType[];

  @Prop({ type: String, default: '添加设备' }) private readonly title!: string;
  @PropSync('visible', { type: Boolean, required: true })
  private flag!: boolean;

  @Prop({ type: Object, required: true })
  private device!: DeviceInterface;

  private info: DeviceInterface = JSON.parse(JSON.stringify(this.device));

  private onCancel () {
    MessageBox.confirm('确定取消吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.flag = false
      Message.info('操作已取消')
    })
  }

  private onConfirm () {
    console.log(this.info)
    let flag = true;
    (!this.info.fac_id || this.info.fac_id < 10000000) && (flag = false)
    !this.info.fac_name && (flag = false)
    !this.info.fac_type && (flag = false)
    !this.info.read_interval && (flag = false)
    !this.info.relay_extend_count && this.info.relay_extend && (flag = false)
    !!this.info.sensor &&
      !this.info.sensor.length &&
      this.info.relay &&
      !this.info.relay.length &&
      (flag = false)

    if (flag === true) {
      MessageBox.confirm(`确定要${this.title}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('edit-device-confirm', this.info)
      })
    } else {
      Message.info('参数错误，请检查参数')
    }
  }

  @Watch('device', { immediate: true, deep: true })
  private deviceChange (value: DeviceInterface) {
    this.info = JSON.parse(JSON.stringify(value))
  }
}
</script>

<style lang="scss" scoped>
.new {
  width: 100%;
  height: 100%;
  color: black;
  .title {
    font-size: 0.2rem;
    font-weight: normal;
    margin-bottom: 0.05rem;
  }
}
</style>
<style lang="scss">
.dialog {
  .el-dialog__body {
    padding: 0;
  }

  /*********************** 滚动条配置********************************/
  .scroolbar {
    height: 70vh;
    .el-scrollbar__wrap {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }
  }
  /***************************************************************/
}
</style>
