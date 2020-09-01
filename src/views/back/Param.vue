<template>
  <div class="list" v-if="flag">
    <el-scrollbar class="scroolbar" :wrapStyle="{ margin: 0 }" :native="false">
      <el-collapse v-model="activeCollapse" accordion>
        <!-- 库中 轮灌参数显示 -->
        <el-collapse-item
          v-for="(param, index) in params"
          :key="index"
          :name="index.toString()"
          style="padding:0"
        >
          <template slot="title">
            <div class="listTitle">
              <span
                >编号:<em>{{ param.id }}</em></span
              >
              <span
                >开始时间:<em>{{ param.startTime | dateFormat }}</em></span
              >
              <span
                >预计结束时间:<em>{{ param.endTime | dateFormat }}</em></span
              >
              <span
                >灌区:<em :title="getGroupName(param)">{{
                  getGroupName(param)
                }}</em></span
              >
              <span>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  circle
                  @click.stop="onDeleteClick(index)"
                ></el-button>
              </span>
            </div>
          </template>
          <param-list
            :params="param"
            :group-list="GroupList"
            :default-group-info="defaultGroupInfo"
            @param-list-start-time-change="onOriginStartTimeChange"
            @param-list-group-add="onOriginParamListAdd"
            @param-list-group-change="onOriginGroupListChange"
            @param-list-group-delete="onOriginGroupListdelete"
          ></param-list>
        </el-collapse-item>

        <!-- 新增 轮灌参数 -->
        <el-collapse-item v-if="!!addParam" :name="params.length.toString()">
          <template slot="title">
            <div class="listTitle">
              <span
                >编号:<em>{{ addParam.id }}</em></span
              >
              <span
                >开始时间:<em>{{ addParam.startTime | dateFormat }}</em></span
              >
              <span
                >预计结束时间:<em>{{
                  addParam.startTime | dateFormat
                }}</em></span
              >
              <span
                >灌区:<em :title="getGroupName(addParam)">{{
                  getGroupName(addParam)
                }}</em></span
              >
              <span>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-check"
                  circle
                  @click.stop="onAddRecordCheckClick"
                ></el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-close"
                  circle
                  @click.stop="onAddRecordCancelClick"
                ></el-button>
              </span>
            </div>
          </template>
          <param-list
            :flag="true"
            :params="addParam"
            :group-list="GroupList"
            :default-group-info="defaultGroupInfo"
          ></param-list>
        </el-collapse-item>
      </el-collapse>
      <!-- <new-param></new-param> -->
      <!-- <param-list></param-list> -->
      <div class="add">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          circle
          title="添加灌区"
          :disabled="!!addParam"
          @click="onAddClick"
        ></el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import moment from 'moment'

import { Collapse, CollapseItem, Message, MessageBox } from 'element-ui'

import IrrigationSystem, {
  TurnGroupContent
} from '@/components/back/param/IrrigationSystem.vue'
import ParamList, {
  TurnRecordInterface
} from '@/components/back/param/ParamList.vue'
import NewParam from '@/components/back/param/NewParam.vue'

import * as Bus from '@/utils/bus'

import {
  Fer,
  Group,
  TurnRecord,
  TurnFer,
  TurnContent
} from '@/app/main/database/model'

import { namespace } from 'vuex-class'
Vue.use(Collapse)
Vue.use(CollapseItem)
const databaseModule = namespace('database')
const otherModule = namespace('other')

@Component({
  components: {
    ParamList,
    NewParam
  },
  filters: {
    dateFormat: (value: any, format: string) => {
      return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
    }
  }
})
export default class Param extends Vue {
  @databaseModule.State('Group') private GroupList: Group[];
  @databaseModule.State('TurnContent') private TurnContent: TurnContent[];
  @databaseModule.State('TurnFer') private TurnFer: TurnFer[];
  @databaseModule.State('Fer') ferType!: Fer[];
  @databaseModule.State('TurnRecord') private TurnRecord: TurnRecord[];
  @databaseModule.Action('saveTurnContent') saveTurnContent!: (
    param: any[]
  ) => void;

  @databaseModule.Action('saveTurnFer') saveTurnFer!: (param: any[]) => void;
  @databaseModule.Action('saveTurnRecord') saveTurnRecord!: (
    param: any[]
  ) => void;

  @otherModule.State('TurnInfo') private TurnInfo: TurnRecordInterface[];
  @otherModule.Action('saveTurnInfo') private saveTurnInfo!: (
    param: any[]
  ) => void;

  private params: TurnRecordInterface[] = [];

  private defaultGroupInfo = {
    group: undefined,
    delay: 30,
    runTime: 60,
    type: 2,
    fer: [
      {
        id: 1,
        ferType: {
          id: 1,
          name: '氮肥'
        },
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 2,
        ferType: {
          id: 1,
          name: '氮肥'
        },
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 3,
        ferType: {
          id: 1,
          name: '氮肥'
        },
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 4,
        ferType: {
          id: 1,
          name: '氮肥'
        },
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      }
    ]
  };

  private addParam: any = null;

  private activeCollapse = '0';

  private getGroupName (param: any) {
    // console.log(param);
    // if (!param.group.leng) return "";
    return param.group.map((item: any) => item.group.name).join(',')
  }

  private onAddClick () {
    console.log(this.activeCollapse, this.params.length)
    this.activeCollapse = this.params.length.toString()
    // console.log("click", this.activeCollapse);
    this.addParam = {
      id: this.params.length > 0 ? this.params.slice(-1)[0].id + 1 : 1,
      startTime: new Date().getTime(),
      userId: 0,
      name: '',
      createTime: 0,
      state: 0,
      group: []
    }
  }

  private async onDeleteClick (index: number) {
    const param = this.params[index]
    // 删除轮灌记录
    let result = await Bus.deleteTurnRecord(param.id)
    console.log(result)

    const ferId = []
    const contentId = param.group.map((group: TurnGroupContent) => {
      console.log(group)
      const id = group.fer.forEach((fer: any) => {
        ferId.push(fer.id)
      })

      return group.id
    })

    result = await Bus.deleteTurnContent(contentId)
    console.log(result)
    result = await Bus.deleteTurnFer(ferId)
    console.log(result)

    this.params.splice(index, 1)
    this.addParam = null
    this.updateTurnInfoState()
  }

  private async onAddRecordCheckClick () {
    console.log(this.addParam.group.length)
    if (this.addParam.group.length) {
      this.params.push(this.addParam)
      const recordInfo = {
        id: 1,
        user_id: 1,
        name: null,
        create_time: new Date().getTime(),
        start_time: this.addParam.startTime,
        state: 0
      }
      const result = await Bus.createTurnRecord(recordInfo)
      console.log(result)

      const recordId = result.data
      for (let j = 0; j < this.addParam.group.length; j++) {
        const group = this.addParam.group[j]
        let groupInfo: any = {
          name: '',
          turn_record_id: recordId,
          group_id: group.group.id,
          sequence: j,
          delay: group.delay,
          run_time: group.runTime,
          irrigation_type: group.type
        }
        if (group.type !== 1) {
          const ferId = []
          const ferInfo = group.fer.map((fer: any) => {
            return {
              fer_id: fer.ferType.id,
              fer_ratio: fer.ferRatio,
              fer_weight: fer.ferWeight,
              fer_time: fer.ferTime
            }
          })
          for (let i = 0; i < ferInfo.length; i++) {
            const result = await Bus.createTurnFer(ferInfo[i])
            ferId.push(result.data)
            console.log(result)
          }
          groupInfo = {
            name: '',
            turn_record_id: recordId,
            group_id: group.group.id,
            sequence: j,
            delay: group.delay,
            run_time: group.runTime,
            irrigation_type: group.type,
            fer1: ferId[0],
            fer2: ferId[1],
            fer3: ferId[2],
            fer4: ferId[3]
          }
        }

        const result = await Bus.createTurnContent(groupInfo)
        console.log(result)
        // if (result.state === 0) {
        //   Message.success("灌区新增成功");
        //   this.updateTurnInfoState();
        // }
      }

      console.log('lunguan')
      Message.success('轮灌记录新增成功')
      console.log('lunguan')
      this.params.push(this.addParam)
      console.log('lunguan')
      this.updateTurnInfoState()
      console.log('lunguan')
      this.addParam = null
    } else {
      Message.warning('请添加一条灌区信息')
    }
  }

  private onAddRecordCancelClick () {
    MessageBox.confirm('确定取消灌溉记录吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.addParam = null
      })
      .catch(() => {
        Message.info('已取消')
      })
  }

  private async onOriginStartTimeChange (param: TurnRecordInterface) {
    const recordInfo = {
      id: param.id,
      start_time: param.startTime
    }
    const result = await Bus.updateTurnRecord(recordInfo)

    if (result.state === 0) {
      Message.success('灌区开始时间修改成功')
      this.updateTurnInfoState()
    }
  }

  private async onOriginParamListAdd (
    turn: TurnRecordInterface,
    param: TurnGroupContent
  ) {
    let groupInfo: any = {
      name: '',
      turn_record_id: turn.id,
      group_id: param.group.id,
      sequence: turn.group.length,
      delay: param.delay,
      run_time: param.runTime,
      irrigation_type: param.type
    }
    if (param.type !== 1) {
      const ferId = []
      const ferInfo = param.fer.map((fer: any) => {
        return {
          fer_id: fer.ferType.id,
          fer_ratio: fer.ferRatio,
          fer_weight: fer.ferWeight,
          fer_time: fer.ferTime
        }
      })
      for (let i = 0; i < ferInfo.length; i++) {
        const result = await Bus.createTurnFer(ferInfo[i])
        ferId.push(result.data)
        console.log(result)
      }
      groupInfo = {
        name: '',
        turn_record_id: turn.id,
        group_id: param.group.id,
        sequence: turn.group.length,
        delay: param.delay,
        run_time: param.runTime,
        irrigation_type: param.type,
        fer1: ferId[0],
        fer2: ferId[1],
        fer3: ferId[2],
        fer4: ferId[3]
      }
    }
    const result = await Bus.createTurnContent(groupInfo)

    if (result.state === 0) {
      Message.success('灌区新增成功')
      this.updateTurnInfoState()
    }

    console.log(param, groupInfo, result)
  }

  private onOriginGroupListdelete (group: TurnGroupContent, index: number) {
    console.log(index, group)
    const ferId = group.fer.map((fer: any) => fer.id)
    Promise.all([
      Bus.deleteTurnContent(group.id),
      Bus.deleteTurnFer(ferId)
    ]).then((res: any) => {
      if (res[0].state === 0 && res[0].state === 0) {
        Message.success('删除该分区参数成功')
        this.updateTurnInfoState()
      }
    })
  }

  private async onOriginGroupListChange (param: TurnGroupContent) {
    const ferInfo = param.fer.map((fer: any) => {
      return {
        id: fer.id,
        fer_id: fer.ferType.id,
        fer_ratio: fer.ferRatio,
        fer_weight: fer.ferWeight,
        fer_time: fer.ferTime
      }
    })
    for (let i = 0; i < ferInfo.length; i++) {
      console.log(param)
      const result = await Bus.updateTurnFer(ferInfo[i])
      console.log(result)
    }
    const groupInfo = {
      id: param.id,
      name: '',
      turn_record_id: param.recordId,
      group_id: param.group.id,
      sequence: param.group.length,
      delay: param.delay,
      run_time: param.runTime,
      irrigation_type: param.type,
      fer1: param.fer[0].id,
      fer2: param.fer[1].id,
      fer3: param.fer[2].id,
      fer4: param.fer[3].id
    }
    const result = await Bus.updateTurnContent(groupInfo)

    if (result.state === 0) {
      Message.success('灌区修改成功')
      this.updateTurnInfoState()
    }
  }

  private getScheduledTime (param: TurnRecordInterface) {
    let time = param.startTime
    param.group.forEach((item: any) => {
      time += (item.runTime + item.delay) * 6000
    })
    console.log(time)
    return time
  }

  private updateTurnInfoState () {
    Promise.all([
      Bus.getTurnRecord(),
      Bus.getTurnFer(),
      Bus.getTurnContent()
    ]).then((res: any[]) => {
      console.log(res)
      if (res[0].state === 0) {
        this.saveTurnRecord(res[0].data)
      } else {
        Message.warning(res[0].type + '-' + res[0].msg)
      }
      if (res[1].state === 0) {
        this.saveTurnFer(res[1].data)
      } else {
        Message.warning(res[1].type + '-' + res[1].msg)
      }
      if (res[2].state === 0) {
        this.saveTurnContent(res[2].data)
      } else {
        Message.warning(res[2].type + '-' + res[2].msg)
      }
    })
  }

  private get getParams () {
    const params = this.TurnRecord.map((recode: TurnRecord) => {
      const content = this.TurnContent.filter(
        (content: TurnContent) => recode.id === content.turn_record_id
      )
      const Fer = this.TurnFer.map((fer: TurnFer) => {
        return {
          id: fer.id,
          ferType: this.ferType.find(
            (ferType: Fer) => ferType.id === fer.fer_id
          ),
          ferRatio: fer.fer_ratio,
          ferWeight: fer.fer_weight,
          ferTime: fer.fer_time
        }
      })

      const param: TurnRecordInterface = {
        id: recode.id,
        startTime: recode.start_time,
        endTime: 0,
        userId: recode.user_id,
        name: recode.name,
        createTime: recode.create_time,
        state: recode.state,
        group: content.map((content: TurnContent) => {
          return {
            id: content.id,
            recordId: content.turn_record_id,
            group: this.GroupList.find(
              (group: Group) => group.id === content.group_id
            ),
            delay: content.delay,
            runTime: content.run_time,
            sequence: content.sequence,
            type: content.irrigation_type,
            fer: Fer.filter(
              (fer: TurnFer) =>
                fer.id === content.fer1 ||
                fer.id === content.fer2 ||
                fer.id === content.fer3 ||
                fer.id === content.fer4
            )
          }
        })
      }
      param.endTime = this.getScheduledTime(param)
      return param
    })
    return params
  }

  // 强制刷新使用
  private flag = true;
  @Watch('getParams', { immediate: true, deep: true })
  private saveTurnInfos (value: any) {
    // this.flag = false;
    const activeCollapse = this.activeCollapse
    this.$nextTick(() => {
      this.saveTurnInfo(value)
      this.params = JSON.parse(JSON.stringify(value))
      this.$forceUpdate()
      console.log(value)
      // this.flag = true;
      this.activeCollapse = activeCollapse
    })
  }
}
</script>

<style lang="scss" scoped>
.list {
  .scroolbar {
    height: 6.5rem;
    .listTitle {
      width: 100%;
      // height: 80px;
      // line-height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 12px;
        margin-left: 10px;
        text-align: left;

        em {
          margin-left: 5px;
          color: rgb(7, 107, 114);
          font-size: 16px;
          font-weight: bold;
        }

        &:nth-of-type(4) {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 0.7;
        }
      }
      .online {
        color: green;
      }
    }

    .add {
      text-align: center;
      padding-top: 0.05rem;
    }
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}
</style>
