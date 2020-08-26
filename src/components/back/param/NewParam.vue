<template>
  <div>
    <p>开始时间 : 2020-08-21 08:47:07</p>
    <p>预计结束时间： 2020-08-21 08:47:07</p>
    <el-form
      class="demo-ruleForm"
      :model="form"
      :rules="rules"
      ref="form"
      status-icon
      label-width="100px"
    >
      <el-form-item label="灌区名称:" prop="name">
        <el-input type="text" v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="启动延迟时间:" prop="delay">
        <el-input-number
          type="text"
          v-model="form.delay"
          autocomplete="off"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="运行时间:" prop="runTime">
        <el-input-number
          type="text"
          v-model="form.runTime"
          autocomplete="off"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="灌溉模式:" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">仅灌溉</el-radio>
          <el-radio :label="2">定时施肥</el-radio>
          <el-radio :label="3">定量施肥</el-radio>
          <el-radio :label="4">定比施肥</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="施肥通道:" prop="channel">
        <el-select v-model="form.channel" placeholder="请选择">
          <el-option
            v-for="index in 4"
            :key="index"
            :label="'通道' + index"
            :value="index - 1"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="施肥类型:">
        <el-select v-model="form.fer[form.channel].name" placeholder="请选择">
          <el-option
            v-for="fer in ferType"
            :key="fer.id"
            :label="fer.name"
            :value="fer.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="施肥时间:" v-if="form.type === 2">
        <el-input-number
          type="text"
          v-model="form.fer[form.channel].ferTime"
          autocomplete="off"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="施肥量:" v-if="form.type === 3">
        <el-input-number
          type="text"
          v-model="form.fer[form.channel].ferWeight"
          autocomplete="off"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="施肥配比:" v-if="form.type === 4">
        <el-input-number
          type="text"
          v-model="form.fer[form.channel].ferRatio"
          autocomplete="off"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="onConfirmClick">确认</el-button>
        <el-button type="danger" round @click="onCancelClick">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import {
  Card,
  Transfer,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Option,
  Message,
  Radio,
  RadioGroup
} from 'element-ui'
Vue.use(Transfer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(Card)
Vue.use(Radio)
Vue.use(RadioGroup)

@Component
export default class NewParam extends Vue {
  private form = {
    name: '灌区A',
    delay: 30,
    runTime: 10,
    type: 2,
    channel: 0,
    fer: [
      {
        name: '氮肥',
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        name: '磷肥',
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        name: '钾肥',
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        name: '碳肥',
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      }
    ]
  };

  private rules = {
    name: [{ required: true, message: '请输入灌区名称', trigger: 'blur' }],
    delay: [{ required: true, message: '请输入启动延迟时间', trigger: 'blur' }],
    runTime: [{ required: true, message: '请输入运行时间', trigger: 'blur' }]
    // ferTime: [{ required: true, message: "请输入施肥时间", trigger: "change" }],
    // ferRatio: [
    //   { required: true, message: "请输入肥料比例", trigger: "change" }
    // ],
    // ferWeight: [{ required: true, message: "请输入肥料量", trigger: "change" }]
  };

  private editFlag = true;
  private ferType = [
    {
      id: 1,
      name: '氮肥'
    },
    {
      id: 2,
      name: '磷肥'
    },
    {
      id: 3,
      name: '钾肥'
    },
    {
      id: 4,
      name: '碳肥'
    }
  ];

  private onConfirmClick () {
    console.log(this.form)
  }

  private onCancelClick () {
    // console.log(this.data, this.value);
  }
}
</script>

<style scoped></style>
