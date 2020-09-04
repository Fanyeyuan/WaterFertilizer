<template>
  <div class="new">
    <el-form
      class="demo-ruleForm"
      :model="form"
      :rules="rules"
      ref="form"
      status-icon
      label-width="100px"
    >
      <el-form-item label="灌区名称" prop="name">
        <el-input
          type="text"
          class="group"
          v-model="form.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="作物名称" prop="crop">
        <!-- <el-input type="text" v-model="form.crop" autocomplete="off"></el-input> -->
        <el-select v-model="form.crop" value-key="id" placeholder="请选择">
          <el-option
            v-for="item in Crop"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择水肥机" prop="machine">
        <el-select v-model="form.machine" value-key="id" placeholder="请选择">
          <el-option
            v-for="item in machine"
            :key="item.id"
            :label="item.fac_name"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择阀门" prop="valve">
        <el-transfer
          filterable
          filter-placeholder="请输入设备名称"
          v-model="form.valve"
          :data="form.allValve"
          :titles="['所有设备', '灌区设备']"
        ></el-transfer>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="onConfirmClick">确认</el-button>
        <el-button type="danger" round @click="onCancelClick">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Emit, Prop, Watch } from 'vue-property-decorator'

import { Crop } from '@/app/main/database/model'
import { namespace } from 'vuex-class'

import { DeviceInterface } from '@/utils/types/type'

import {
  Transfer,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Message
} from 'element-ui'
const otherModule = namespace('other')
const databaseModule = namespace('database')
Vue.use(Transfer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)

@Component
export default class NewGroup extends Vue {
  @databaseModule.State('Crop') Crop!: Crop[];
  @otherModule.State('DeviceList') deviceList!: DeviceInterface[];

  @Prop({ type: Array, required: true }) device!: any[];
  @Prop({ type: Array, required: true }) machine!: any[];
  @Prop({ type: Object }) group!: any;

  private form: {
    name: string;
    crop: any;
    machine: any;
    valve: any[];
    allValve: any[];
  } = {
    name: '',
    crop: null,
    machine: null,
    valve: [],
    allValve: []
  };

  private rules = {
    name: [{ required: true, message: '请输入灌区名称', trigger: 'blur' }],
    crop: [{ required: true, message: '请输入作物名称', trigger: 'blur' }],
    machine: [
      { required: true, message: '请选择灌区水肥机', trigger: 'change' }
    ],
    valve: [{ required: true, message: '请选择灌区阀门', trigger: 'change' }]
  };

  @Ref('form') private readonly groupForm!: Form;

  @Watch('device', { immediate: true, deep: true })
  private generateData (value: DeviceInterface[]) {
    const list = JSON.parse(JSON.stringify(value))
    if (this.group.name) {
      // console.log(list);
      this.group.device.forEach((device: any) => {
        // if (!list.some((dev: any) => device.facId === dev.fac_id))
        //   list.push(device.device);
        // console.log(device, list);
        if (device.exp != null) {
          const tmp = JSON.parse(JSON.stringify(device.device))
          // console.log(tmp, list);
          tmp.relay = [device.device.relay[Number(device.exp)]]
          list.push(tmp)
        }
      })
    }
    list.map((item: DeviceInterface) => {
      let valve
      if (item.fac_type.id === 6) {
        item.relay.map((relay: any, index: number) => {
          const name =
            relay.name !== '-' ? relay.name : relay.relay.name + index
          valve = {
            key: item.fac_id * 1000 + relay.index, // 如果有多个节点，则将设备ID 乘以1000 然后加上index
            label: item.fac_name + '-' + name,
            facId: item.fac_id,
            exp: relay.index
          }
          this.form.allValve.push(valve)
        })
      } else {
        valve = {
          key: item.fac_id,
          label: item.fac_name,
          facId: item.fac_id,
          exp: null
        }
        this.form.allValve.push(valve)
      }
    })
    // console.log(list, this.form);
  }

  @Watch('group', { immediate: true, deep: true })
  private getValve (group: any) {
    // console.log(this.form);
    if (Object.keys(group).length !== 0) {
      this.form.name = group.name
      this.form.crop = group.crop
      this.form.machine = group.machine
      this.form.valve = this.group.device.map((device: any) => {
        const valve = this.form.allValve.find(
          (valve: any) =>
            valve.facId === device.facId && valve.exp === device.exp
        ) || { key: '', lable: '', facId: 0, exp: null }
        // console.log(device, valve);
        return valve.key
      })
      // console.log(group, this.form);
    }
  }

  @Emit('new-group-comfirm')
  private confirm(data: any) {} // eslint-disable-line

  @Emit('new-group-cancel')
  private cancel() {} // eslint-disable-line

  private onConfirmClick () {
    // console.log(this.form, this.groupForm);
    const getGroupDevice = () => {
      if (!this.group.name) {
        // 如果是新建灌区
        return this.form.valve.map((valve: any) => {
          const item = this.form.allValve.find(
            (item: any) => item.key === valve
          ) || { key: '', lable: '', facId: 0, exp: null }
          const device = this.deviceList.find(
            (device: DeviceInterface) => device.fac_id === item.facId
          )
          return {
            facId: item.facId,
            facName: undefined,
            exp: item.exp
          }
        })
      } else {
        const group = JSON.parse(JSON.stringify(this.group))
        // console.log(group.device, this.form.valve);
        // 如果是修改灌区
        this.form.valve.forEach((valve: any) => {
          // 查找当前被选中的设备
          const item = this.form.allValve.find(
            (item: any) => item.key === valve
          ) || { key: '', lable: '', facId: 0, exp: null }

          // 标记被删除的数据
          const device = group.device.find((device: any) => {
            // console.log(item.facId, device.facId, item.exp, device.exp);
            return item.facId === device.facId && item.exp === device.exp
          })
          if (device) {
            // 如果存在
            this.$set(device, 'isExist', true)
            // console.log(device);
          } else {
            // 如果不存在
            // console.log(device);
            group.device.push({
              facId: item.facId,
              facName: undefined,
              exp: item.exp
            })
          }
        })
        return group.device
      }
    }
    const getGroupMachine = (machine: DeviceInterface) => {
      return {
        facName: machine.fac_name,
        facId: machine.fac_id,
        device: machine,
        item: undefined
      }
    }
    this.groupForm.validate(valid => {
      if (valid) {
        const data = {
          id: this.group.id,
          name: this.form.name,
          crop: this.form.crop,
          machine: this.form.machine,
          device: getGroupDevice()
        }
        this.confirm(data)
      } else {
        Message.error('请输入相应内容')
      }
    })
  }

  private onCancelClick () {
    // console.log(this.data, this.value);
    this.groupForm.resetFields()
    this.cancel()
  }
}
</script>

<style lang="scss" scoped>
.new {
  width: 90%;
  margin: 0.2rem auto;
  padding: 0.2rem;
  background: white;
  /* display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; */

  .group {
    width: 40%;
  }
}
</style>
