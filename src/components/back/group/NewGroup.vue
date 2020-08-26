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
        <el-input type="text" v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="作物名称" prop="crop">
        <el-input type="text" v-model="form.crop" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择水肥机" prop="machine">
        <el-select v-model="form.machine" placeholder="请选择">
          <el-option
            v-for="item in machine"
            :key="item.facId"
            :label="item.facName"
            :value="item.facId"
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
          @change="onTransferChange"
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

import {
  Transfer,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Message
} from 'element-ui'
Vue.use(Transfer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)

@Component
export default class NewGroup extends Vue {
  @Prop({ type: Array, required: true }) device!: any[];
  @Prop({ type: Array, required: true }) machine!: any[];
  @Prop({ type: Object }) group!: any;

  private form = {
    name: '',
    crop: '',
    machine: 1,
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
  private generateData (list: any) {
    list.map((item: any) => {
      const valve = {
        key: item.facId,
        label: item.facName
      }
      this.form.allValve.push(valve)
    })
    // console.log(list, this.form);
  }

  @Watch('group', { immediate: true, deep: true })
  private getValve (group: any) {
    if (Object.keys(group).length !== 0) {
      this.form.name = group.name
      this.form.crop = group.crop
      this.form.machine = this.device.find(
        item => item.facId === group.machine.facId
      )
      this.form.valve = group.device.map((value: any) => {
        const device = this.device.find(item => item.facId === value.facId)
        return device.facId
      })
      // console.log(group, this.form);
    }
  }

  // private onTransferChange(event, data, params) {
  //   console.log(event, data, params);
  // }

  @Emit('new-group-comfirm')
  private confirm(data: any) {} // eslint-disable-line

  @Emit('new-group-cancel')
  private cancel() {} // eslint-disable-line

  private onConfirmClick () {
    // console.log(this.form, this.groupForm);
    this.groupForm.validate(valid => {
      if (valid) {
        const data = {
          name: this.form.name,
          crop: this.form.crop,
          machine: this.device.find(item => item.facId === this.form.machine),
          device: this.form.valve.map(value => {
            return this.device.find(item => item.facId === value)
          })
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
  width: 85%;
  margin: 0.2rem auto;
  padding: 0.2rem;
  background: white;
  /* display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; */
}
</style>
