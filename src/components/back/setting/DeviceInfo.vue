<template>
  <el-form :model="info" :rules="rules" ref="form">
    <el-form-item size="small" prop="fac_id" label="设备ID" label-width="90px">
      <el-input-number
        v-model="info.fac_id"
        size="small"
        :controls="false"
        autocomplete="off"
        placeholder="请输入设备ID"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      size="small"
      prop="fac_name"
      label="设备名称"
      label-width="90px"
    >
      <el-input
        v-model="info.fac_name"
        size="small"
        autocomplete="off"
        placeholder="请输入设备名称"
      ></el-input>
    </el-form-item>
    <el-form-item size="small" label="备注" label-width="90px">
      <el-input
        v-model="info.remark"
        size="small"
        autocomplete="off"
        placeholder="请输入备注"
      ></el-input>
    </el-form-item>
    <el-form-item
      size="small"
      prop="fac_type"
      label="设备类型"
      label-width="90px"
    >
      <el-select
        v-model="info.fac_type"
        size="small"
        value-key="id"
        placeholder="请选择设备类型"
      >
        <el-option
          :label="item.name"
          :value="item"
          v-for="item in deviceTypes"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item size="small" label="经度" label-width="90px">
      <el-input-number
        v-model="info.longitude"
        type="number"
        size="small"
        :controls="false"
        autocomplete="off"
        placeholder="请输入经度"
      ></el-input-number>
    </el-form-item>
    <el-form-item size="small" label="纬度" label-width="90px">
      <el-input-number
        v-model="info.latitude"
        type="number"
        size="small"
        :controls="false"
        autocomplete="off"
        placeholder="请输入纬度"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      size="small"
      prop="read_interval"
      label="读取间隔"
      label-width="90px"
    >
      <el-input-number
        class="readInterval"
        v-model="info.read_interval"
        controls-position="right"
        size="small"
        :min="1"
        :max="60"
        autocomplete="off"
      ></el-input-number>
    </el-form-item>
    <el-form-item size="small" label="扩展控制" label-width="90px">
      <el-switch
        v-model="info.relay_extend"
        active-color="#409EFF"
        inactive-color="gray"
      ></el-switch>
    </el-form-item>
    <el-form-item
      size="small"
      prop="relay_extend_count"
      label="扩展数量"
      label-width="90px"
      v-if="info.relay_extend"
    >
      <el-input-number
        class="readInterval"
        v-model="info.relay_extend_count"
        controls-position="right"
        size="small"
        :min="1"
        :max="255"
        autocomplete="off"
      ></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'

import { Form } from 'element-ui'
import { Device, FacType } from '@/app/main/database/model'
import { DeviceInterface } from '@/utils/types/type'

@Component
export default class DeviceInfo extends Vue {
  @Prop({ type: Object, required: true })
  private readonly info!: DeviceInterface;

  @Prop({ type: Array, required: true })
  private readonly deviceTypes!: FacType[];

  @Ref('form') readonly infoForm!: Form;

  private rules = {
    fac_id: { required: true, message: "请输入设备ID", trigger: "blur" }, // eslint-disable-line
    fac_name: { required: true, message: "请输入设备名称", trigger: "blur" }, // eslint-disable-line
    fac_type: { required: true, message: "请选择设备类型", trigger: "blur" }, // eslint-disable-line
    read_interval: {
      // eslint-disable-line
      required: true,
      message: '请输入读取时间间隔',
      trigger: 'blur'
    },
    relay_extend_count: {
      // eslint-disable-line
      required: true,
      message: '请输入扩展继电器个数',
      trigger: 'blur'
    }
  };

  private mounted () {
    console.log(this.deviceTypes)
    !this.info.relay_extend_count && (this.info.relay_extend_count = 1); // eslint-disable-line
    !this.info.read_interval && (this.info.read_interval = 1); // eslint-disable-line
    !this.info.fac_type && // eslint-disable-line
      (this.info.fac_type = {
        // eslint-disable-line
        id: 1,
        name: '气象站'
      })
  }
}
</script>

<style scoped></style>
