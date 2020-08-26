<template>
  <div class="group">
    <el-row class="row" :gutter="10" type="flex">
      <el-col :span="6">
        <div class="left">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>设备列表</span>
            </div>
            <div
              v-for="device in deviceList"
              :key="device.facId"
              class="text item"
            >
              {{ device.facName }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="right" v-if="groups.length">
          <el-row
            type="flex"
            :gutter="5"
            justify="start"
            style="flex-wrap: wrap"
          >
            <el-col class="item" v-for="(group, index) in groups" :key="index">
              <el-card
                class="box-card"
                :body-style="{ height: '80%', padding: 0 }"
                shadow="hover"
              >
                <div slot="header" class="clearfix">
                  <!-- <div style="float: left; padding: 3px 0">
                    <p>灌区名称:{{ group.name }}</p>
                    <p>作物:{{ group.crop }}</p>
                    <p>水肥机:{{ group.machine.facName }}</p>
                  </div> -->
                  <!-- <el-tooltip content="灌区名称" placement="top">
                    <el-button>{{ group.name }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="作物名称" placement="top">
                    <el-button>{{ group.crop }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="水肥机" placement="top">
                    <el-button>{{ group.machine.facName }}</el-button>
                  </el-tooltip> -->
                  <el-tag title="灌区名称" type="info">{{ group.name }}</el-tag>
                  <el-tag title="作物名称" type="info">{{ group.crop }}</el-tag>
                  <el-tag title="水肥机" type="info">{{
                    group.machine.facName
                  }}</el-tag>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    icon="el-icon-edit"
                    circle
                    @click="onOpenNewGroupClick(group)"
                  ></el-button>
                </div>
                <el-scrollbar
                  class="scroolbar"
                  :wrapStyle="{ margin: 0 }"
                  :native="false"
                >
                  <div
                    v-for="device in group.device"
                    :key="device.facId"
                    class="text"
                  >
                    {{ device.facName }}
                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col class="item">
              <el-card class="box-card" :body-style="{ height: '80%' }">
                <div class="gain-group" @click="onOpenNewGroupClick">
                  <i class="el-icon-plus"></i>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="add" v-if="addFlag">
      <new-group
        :device="deviceList"
        :machine="deviceList"
        :group="group"
        @new-group-comfirm="onNewGroupEvent"
        @new-group-cancel="onNewGroupEvent"
      ></new-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import NewGroup from '@/components/back/group/NewGroup.vue'

import { Card, Tooltip } from 'element-ui'
Vue.use(Card)
Vue.use(Tooltip)

@Component({
  components: {
    NewGroup
  }
})
export default class Group extends Vue {
  private deviceList: any = [
    {
      facId: 16061101,
      facName: '设备16061101'
    },
    {
      facId: 16061102,
      facName: '设备16061102'
    }
  ];

  private groups: any[] = [
    {
      name: '灌区A',
      crop: '玉米',
      machine: {
        facId: 16061102,
        facName: '设备16061102'
      },
      device: [
        {
          facId: 16061101,
          facName: '设备16061101'
        },
        {
          facId: 16061102,
          facName: '设备16061102'
        },
        {
          facId: 16061103,
          facName: '设备16061103'
        },
        {
          facId: 16061104,
          facName: '设备16061104'
        },
        {
          facId: 16061105,
          facName: '设备16061105'
        },
        {
          facId: 16061106,
          facName: '设备16061106'
        }
      ]
    },
    {
      name: '灌区B',
      crop: '棉花',
      machine: {
        facId: 16061102,
        facName: '设备16061102'
      },
      device: [
        {
          facId: 16061102,
          facName: '设备16061102'
        }
      ]
    },
    {
      name: '灌区C',
      crop: '土豆',
      machine: {
        facId: 16061102,
        facName: '设备16061102'
      },
      device: [
        {
          facId: 16061102,
          facName: '设备16061102'
        }
      ]
    },
    {
      name: '灌区C',
      crop: '土豆',
      machine: {
        facId: 16061102,
        facName: '设备16061102'
      },
      device: [
        {
          facId: 16061102,
          facName: '设备16061102'
        }
      ]
    }
  ];

  private group: any = {
    name: '灌区B',
    crop: '棉花',
    machine: {
      facId: 16061102,
      facName: '设备16061102'
    },
    device: [
      {
        facId: 16061102,
        facName: '设备16061102'
      }
    ]
  };

  private addFlag = false;

  onOpenNewGroupClick (data: any) {
    this.addFlag = true
    // console.log(this.addFlag, data);
    if (data.name) {
      this.group = data
    } else {
      this.group = {}
    }
  }

  onNewGroupEvent (data?: any) {
    this.addFlag = false
    console.log(data)
    if (data) {
      this.group = data
      this.groups.push(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.group {
  width: 100%;
  height: 100%;
  position: relative;

  .row {
    height: 95%;
    .left {
      height: 100%;
    }
    .right {
      height: 100%;
      .item {
        height: 2.5rem;
        width: 2rem;
        margin-bottom: 0.05rem;

        .gain-group {
          font-size: 0.32rem;
          text-align: center;
          line-height: 148px;
          width: 100%;
          height: 100%;
          cursor: pointer;

          &:hover i {
            color: #409eff;
          }
        }
      }
    }

    /*********************** 卡片css 配置********************************/
    .box-card {
      height: 100%;
    }
    .text {
      font-size: 0.14rem;
      text-align: center;
      padding: 0.04rem 0;
    }

    .clearfix {
      text-align: center;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both;
    }
    /***************************************************************/

    /*********************** 滚动条配置********************************/
    .scroolbar {
      height: 100%;
      .el-scrollbar__wrap {
        overflow-y: scroll !important;
      }
    }
    /***************************************************************/
  }

  .add {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
  }
}
</style>

<style>
.el-card__header {
  padding: 0.09rem !important;
}
</style>
