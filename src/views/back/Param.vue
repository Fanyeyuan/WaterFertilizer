<template>
  <div class="list">
    <el-scrollbar class="scroolbar" :wrapStyle="{ margin: 0 }" :native="false">
      <el-collapse :value="activeCollapse" accordion>
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
                >预计结束时间:<em>{{
                  getScheduledTime(param) | dateFormat
                }}</em></span
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
            @param-list-group-add="onParamListAdd"
          ></param-list>
        </el-collapse-item>

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
                  @click.stop="onCheckClick"
                ></el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-close"
                  circle
                  @click.stop="onCancelClick"
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

import { Collapse, CollapseItem, Message } from 'element-ui'

import ParamList, {
  TurnRecordInterface
} from '@/components/back/param/ParamList.vue'
import NewParam from '@/components/back/param/NewParam.vue'

import {
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
  @databaseModule.State('TurnRecord') private TurnRecord: TurnRecord[];
  @otherModule.State('TurnInfo') private TurnInfo: TurnRecordInterface[];
  @otherModule.Action('saveTurnInfo') private saveTurnInfo!: (
    param: any[]
  ) => void;

  private params: TurnRecordInterface[];

  private defaultGroupInfo = {
    group: {
      id: 1,
      name: '灌区A',
      user_id: 0, // eslint-disable-line
      create_time: 0, // eslint-disable-line
      crop_id: 1, // eslint-disable-line
      machine_id: 1 // eslint-disable-line
    },
    delay: 30,
    runTime: 60,
    type: 2,
    fer: [
      {
        id: 1,
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 2,
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 3,
        ferRatio: 1,
        ferWeight: 300,
        ferTime: 30
      },
      {
        id: 4,
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

  private onDeleteClick (index: number) {
    this.params.splice(index, 1)
    this.addParam = null
  }

  private onCheckClick () {
    console.log(this.addParam.group.length)
    if (this.addParam.group.length) {
      this.params.push(this.addParam)
      this.addParam = null
    } else {
      Message.warning('请添加一条灌区信息')
    }
  }

  private onCancelClick () {
    this.addParam = null
  }

  private onParamListAdd () {
    console.log(this.addParam)
  }

  getScheduledTime (param: any) {
    let time = param.startTime
    param.group.forEach((item: any) => {
      time += (item.runTime + item.delay) * 6000
    })
    console.log(time)
    return time
  }

  private get getParams () {
    const params = this.TurnRecord.map((recode: TurnRecord) => {
      const content = this.TurnContent.filter(
        (content: TurnContent) => recode.id === content.turn_record_id
      )

      return {
        id: recode.id,
        startTime: recode.start_time,
        userId: recode.user_id,
        name: recode.name,
        createTime: recode.create_time,
        state: recode.state,
        group: content.map((content: TurnContent) => {
          return {
            group: this.GroupList.find(
              (group: Group) => group.id === content.group_id
            ),
            delay: content.delay,
            runTime: content.run_time,
            type: content.irrigation_type,
            fer: this.TurnFer.filter(
              (fer: TurnFer) =>
                fer.id === content.fer1 ||
                fer.id === content.fer2 ||
                fer.id === content.fer3 ||
                fer.id === content.fer4
            )
          }
        })
      }
    })
    console.log(params)
    return params
  }

  @Watch('getParams', { immediate: true, deep: true })
  private saveTurnInfos (value: any) {
    this.saveTurnInfo(value)
    this.params = JSON.parse(JSON.stringify(value))
    console.log(value)
  }
}
</script>

<style lang="scss" scoped>
.list {
  .scroolbar {
    height: 5rem;
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
