<template>
  <el-row class="list">
    <el-col :span="24">
      <el-row class="time" type="flex">
        <div class="startTime">
          开始时间 :
          <span v-if="!editFlag">{{ param.startTime | dateFormat }}</span>
          <el-date-picker
            size="small"
            type="datetime"
            placeholder="选择日期时间"
            :default-time="param.startTime"
            v-model="param.startTime"
            value-format="timestamp"
            v-else
          >
          </el-date-picker>
        </div>
        <p class="endTime">
          预计结束时间： {{ getScheduledTime | dateFormat }}
        </p>
        <div class="option">
          <div v-if="!editFlag">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="onEditClick"
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
      </el-row>
    </el-col>
    <el-col>
      <div class="groups">
        <el-scrollbar
          class="scroolbar"
          :wrapStyle="{ margin: 0 }"
          :native="false"
          ref="scroll"
        >
          <el-row type="flex">
            <el-col
              :span="10"
              v-for="(group, index) in param.group"
              :key="index"
            >
              <irrigation-system
                class="group"
                :param="group"
                :ferType="ferType"
                :GroupList="GroupList"
                @irrigation-system-check-click="onEditGroupClick"
                @irrigation-system-delete-click="onDeleteGroupClick(index)"
              ></irrigation-system>
            </el-col>
            <el-col v-if="!!addGroup">
              <irrigation-system
                class="group"
                :param="addGroup"
                :ferType="ferType"
                :GroupList="GroupList"
                :flag="true"
                @irrigation-system-check-click="onAddGroupClick"
                @irrigation-system-cancel-click="onCancelGroupClick"
              ></irrigation-system>
            </el-col>
          </el-row>
        </el-scrollbar>
        <div class="add">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            circle
            title="添加灌区"
            @click="onAddClick"
            :disabled="!!addGroup"
          ></el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch, Emit } from 'vue-property-decorator'
import moment from 'moment'

import IrrigationSystem, {
  TurnGroupContent
} from '@/components/back/param/IrrigationSystem.vue'

import { Group } from '@/app/main/database/model'

import { DatePicker, Scrollbar } from 'element-ui'
Vue.use(DatePicker)

export interface TurnRecordInterface {
  id: number;
  startTime: number;
  userId: number;
  name: string;
  createTime: number;
  state: number;
  group: TurnGroupContent[];
  remark?: string;
}

@Component({
  components: {
    IrrigationSystem
  },
  filters: {
    dateFormat: (value: any, format: string) => {
      return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
    }
  }
})
export default class ParamList extends Vue {
  private editFlag = false;
  @Prop({ type: Array, required: true }) private ferType!: any;
  @Prop({ type: Object, required: true }) private params!: TurnRecordInterface;
  private param!: TurnRecordInterface;
  private addGroup: TurnGroupContent | null = null;

  @Prop({ type: Array, required: true }) private GroupList!: Group[];
  @Prop({ type: Object, required: true })
  private defaultGroupInfo!: TurnGroupContent;

  // 编辑状态，true 编辑  false 显示
  @Prop({ type: Boolean, default: false }) private flag!: boolean;

  @Ref() private readonly scroll!: typeof Scrollbar;

  private get getScheduledTime () {
    let time = this.param.startTime
    this.param.group.forEach((item: any) => {
      time += (item.runTime + item.delay) * 6000
    })
    return time
  }

  private onEditClick () {
    this.editFlag = true
    this.param = JSON.parse(JSON.stringify(this.params))
    // console.log(this.param);
  }

  private onCancelClick () {
    this.editFlag = false
    this.param = JSON.parse(JSON.stringify(this.params))
    // console.log(this.param);
  }

  @Emit('param-list-start-time-change')
  private onCheckClick () {
    this.editFlag = false
    // console.log(this.param);
  }

  private onAddClick () {
    this.addGroup = JSON.parse(JSON.stringify(this.defaultGroupInfo))
    this.$nextTick(() => {
      this.scroll.wrap.scrollLeft = this.scroll.wrap.scrollWidth
    })
  }

  @Emit('param-list-group-change')
  private onEditGroupClick (param: TurnGroupContent) {
    const index = this.param.group.findIndex(
      item => item.group.id === param.group.id
    )
    index > -1 && this.param.group.splice(index, 1, param)
  }

  @Emit('param-list-group-delete')
  private onDeleteGroupClick (index: number) {
    this.param.group.splice(index, 1)
  }

  @Emit('param-list-group-add')
  private onAddGroupClick (param: TurnGroupContent) {
    this.param.group.push(param)
    this.addGroup = null
  }

  private onCancelGroupClick () {
    this.addGroup = null
  }

  @Watch('params', { immediate: true, deep: true })
  setGroups (value: any) {
    this.param = value
  }

  @Watch('flag', { immediate: true })
  setFlag (value: boolean) {
    this.editFlag = value
    // console.log(this.editFlag);

    value && this.onAddClick()
  }
}
</script>

<style lang="scss" scoped>
.list {
  .time {
    height: 0.3rem;
    width: 100%;

    .startTime {
      padding-right: 0.05rem;
    }
    .option {
      flex: 1;
      text-align: right;
      display: none;
    }

    &:hover {
      .option {
        display: block;
      }
    }
  }

  .groups {
    position: relative;
    .add {
      position: absolute;
      right: 0;
      top: 0;
      display: none;
    }

    &:hover {
      .add {
        display: block;
      }
    }

    .group {
      margin-right: 0.05rem;
      height: 3.25rem;
    }
  }
}
</style>
