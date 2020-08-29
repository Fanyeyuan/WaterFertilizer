<template>
  <el-card class="box-card" shadow="hover" :body-style="{ padding: 0 }">
    <div class="element">
      <div class="left">灌区名称:</div>
      <div class="right">
        <span v-if="!editFlag">{{ group.group.name }}</span>
        <el-select
          class="select"
          size="small"
          value-key="id"
          v-model="group.group"
          placeholder="请选择"
          v-else
        >
          <el-option
            v-for="item in GroupList"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="element">
      <div class="left">启动延迟(分):</div>
      <div class="right">
        <span v-if="!editFlag">{{ group.delay }}</span>
        <el-input-number
          size="small"
          v-model="group.delay"
          autocomplete="off"
          v-else
        ></el-input-number>
      </div>
    </div>
    <div class="element">
      <div class="left">运行时间(分):</div>
      <div class="right">
        <span v-if="!editFlag">{{ group.runTime }}</span>
        <el-input-number
          size="small"
          v-model="group.runTime"
          autocomplete="off"
          v-else
        ></el-input-number>
      </div>
    </div>
    <div class="element">
      <div class="left">灌溉模式:</div>
      <div class="right">
        <el-radio-group size="small" v-model="group.type" :disabled="!editFlag">
          <el-radio :label="1">仅灌溉</el-radio>
          <el-radio :label="2">定时施肥</el-radio>
          <el-radio :label="3">定量施肥</el-radio>
          <el-radio :label="4">定比施肥</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="element">
      <div class="left">施肥通道:</div>
      <div class="right">
        <el-select size="small" v-model="channel" placeholder="请选择">
          <el-option
            v-for="index in 4"
            :key="index"
            :label="'通道' + index"
            :value="index - 1"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="element">
      <div class="left">施肥类型:</div>
      <div class="right">
        <el-select
          size="small"
          v-model="group.fer[channel].fer_id"
          placeholder="请选择"
          :disabled="!editFlag"
        >
          <el-option
            v-for="fer in ferType"
            :key="fer.id"
            :label="fer.name"
            :value="fer.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="element" v-if="group.type === 2">
      <div class="left">施肥时间(分):</div>
      <div class="right">
        <el-input-number
          size="small"
          v-model="group.fer[channel].ferTime"
          autocomplete="off"
          :disabled="!editFlag"
        ></el-input-number>
      </div>
    </div>
    <div class="element" v-if="group.type === 3">
      <div class="left">施肥量(L):</div>
      <div class="right">
        <el-input-number
          size="small"
          v-model="group.fer[channel].ferWeight"
          autocomplete="off"
          :disabled="!editFlag"
        ></el-input-number>
      </div>
    </div>
    <div class="element" label="施肥配比:" v-if="group.type === 4">
      <div class="left">施肥比例(/1000):</div>
      <div class="right">
        <el-input-number
          size="small"
          v-model="group.fer[channel].ferRatio"
          autocomplete="off"
          :disabled="!editFlag"
        ></el-input-number>
      </div>
    </div>

    <div class="option">
      <div v-if="!editFlag">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-edit"
          circle
          @click="onEditClick"
        ></el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          circle
          @click="onDeleteClick"
        ></el-button>
      </div>
      <div v-else>
        <el-button
          type="success"
          size="small"
          icon="el-icon-check"
          circle
          @click="onCheckClick"
        ></el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-close"
          circle
          @click="onCancelClick"
        ></el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Emit,
  PropSync
} from 'vue-property-decorator'

import { DeviceInterface } from '@/components/back/setting/NewDevice.vue'
import { GroupInterface } from '@/views/back/Group.vue'
import { Group, Fer } from '@/app/main/database/model'
import { namespace } from 'vuex-class'
const databaseModule = namespace('database')

export interface TurnGroupContent {
  group: Group; // 灌区名称
  delay: number; // 延迟时间 分钟
  runTime: number; // 运行时间 分钟
  type: number; // 施肥类型 1 仅灌溉 2 定时施肥 3 定量施肥 4 定比施肥
  fer: {
    id: number; // 肥料对用编号
    ferRatio: number; // 肥料比例
    ferWeight: number; // 施肥量
    ferTime: number; // 施肥时间
  }[];
}

@Component
export default class IrrigationSystem extends Vue {
  @databaseModule.State('Fer') ferType!: Fer[];

  @Prop({ type: Object, required: true }) private param!: TurnGroupContent;
  private group!: TurnGroupContent;

  @Prop({ type: Array, required: true }) private GroupList!: GroupInterface[];

  // 编辑状态，true 编辑  false 显示
  @Prop({ type: Boolean, default: false }) private flag!: boolean;

  private editFlag = false;
  private channel = 0;

  private onEditClick () {
    this.editFlag = true
    // console.log(this.group);
  }

  @Emit('irrigation-system-cancel-click')
  private onCancelClick () {
    this.editFlag = false
    this.group = JSON.parse(JSON.stringify(this.param))
    // console.log(this.group);
  }

  @Emit('irrigation-system-check-click')
  private onCheckClick () {
    this.editFlag = false
    // console.log(this.group);
    return this.group
  }

  @Emit('irrigation-system-delete-click')
  private onDeleteClick() {} // eslint-disable-line

  @Watch('param', { immediate: true, deep: true })
  setGroups (value: any) {
    this.group = value
  }

  @Watch('flag', { immediate: true })
  setFlag (value: boolean) {
    this.editFlag = value
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 3rem;
  position: relative;
  background: rgba($color: gray, $alpha: 0.1);
  .element {
    width: 100%;
    padding: 0.05rem 0.1rem;
    box-sizing: border-box;
    overflow: hidden;
    .left {
      width: 35%;

      float: left;
    }
    .right {
      width: 65%;
      float: right;
      box-sizing: border-box;
      padding: 0 0.05rem;
      text-align: left;

      .select {
        width: 65%;
      }
    }
  }

  .option {
    position: absolute;
    right: 0.02rem;
    top: 0.02rem;
    display: none;
  }

  &:hover {
    .option {
      display: block;
    }
  }
}
</style>
