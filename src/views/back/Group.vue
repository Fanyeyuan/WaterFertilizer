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
              :key="device.fac_id"
              class="text item"
            >
              {{ device.fac_name }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="right">
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
                  </div>-->
                  <!-- <el-tooltip content="灌区名称" placement="top">
                    <el-button>{{ group.name }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="作物名称" placement="top">
                    <el-button>{{ group.crop }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="水肥机" placement="top">
                    <el-button>{{ group.machine.facName }}</el-button>
                  </el-tooltip>-->
                  <el-tag title="灌区名称" type="info">{{ group.name }}</el-tag>
                  <el-tag title="作物名称" type="info">{{
                    group.crop.name
                  }}</el-tag>
                  <el-tag title="水肥机" type="info">
                    {{ group.machine.fac_name }}
                  </el-tag>
                  <el-button
                    style="float: right; padding: 3px 3px; margin-left: 2px"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="onOpenNewGroupClick(group)"
                  ></el-button>
                  <el-button
                    style="float: right; padding: 3px 3px"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="onDeleteGroupClick(group)"
                  ></el-button>
                </div>
                <el-scrollbar
                  class="scroolbar"
                  :wrapStyle="{ margin: 0 }"
                  :native="false"
                >
                  <div
                    v-for="device in group.device"
                    :key="device.id"
                    class="text"
                    :title="device | filterDeviceName"
                  >
                    {{ device | filterDeviceName }}
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
        :device="getCurrentDeviceList"
        :machine="getCurrentMachineList"
        :group="group"
        @new-group-comfirm="onNewGroupEvent"
        @new-group-cancel="onNewGroupCancelEvent"
      ></new-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  Device as FacDevice,
  FacType,
  Element,
  Relay,
  Group as UserGroup,
  Crop,
  GroupDevice
} from '@/app/main/database/model'

import { namespace } from 'vuex-class'

import * as Bus from '@/utils/bus'
import {
  ResponedInterface,
  DeviceInterface,
  RelayInfoInterface
} from '@/utils/types/type'
import NewGroup from '@/components/back/group/NewGroup.vue'

import { Card, Tooltip, Tag, Message, MessageBox } from 'element-ui'
const otherModule = namespace('other')
const databaseModule = namespace('database')
Vue.use(Card)
Vue.use(Tooltip)
Vue.use(Tag)

interface GroupDeviceInterface {
  id: number;
  facId: number; // 灌区对应的设备编号
  facName: string; // 灌区名称
  exp: number; // 阀门对应设备的第几个继电器
  group: Group; // 备份库信息
  device: DeviceInterface; // 设备信息
}

interface GroupInterface {
  id: number;
  userId: number; // 创建用户id 无效
  name: string; // 灌区名称
  createTime: number; // 生成时间
  crop: Crop; // 对应作物
  machine: DeviceInterface; // 对应水肥机
  device: GroupDeviceInterface[]; // 灌区下设备
}

@Component({
  components: {
    NewGroup
  },
  filters: {
    filterDeviceName (device: GroupDeviceInterface) {
      return device.exp === null
        ? device.facName
        : device.facName + '-' + device.device.relay[device.exp].name
    }
  }
})
export default class Group extends Vue {
  @otherModule.State('DeviceList') deviceList!: DeviceInterface[];
  @databaseModule.State('Group') Group!: UserGroup[];
  @databaseModule.State('GroupDevice') GroupDevice!: GroupDevice[];
  @databaseModule.State('Crop') Crop!: Crop[];
  @databaseModule.Action('saveGroup') saveGroup!: (param: any[]) => void;
  @databaseModule.Action('saveGroupDevice') saveGroupDevice!: (
    param: any[]
  ) => void;

  @otherModule.State('GroupList') GroupList!: GroupInterface[];

  private groups: GroupInterface[] = [];

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
    if (data.name) {
      this.group = JSON.parse(JSON.stringify(data))
    } else {
      this.group = {}
    }
  }

  private onNewGroupCancelEvent () {
    MessageBox.confirm('确定放弃设置?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      this.addFlag = false
    })
  }

  private onDeleteGroupClick (group: any) {
    MessageBox.confirm('确定删除该灌区?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let result = await Bus.deleteGroup(group.id)
      if (result.state !== 0) {
        Message.error(result.msg)
        return
      }
      const device = group.device.map((device: any) => {
        return device.id
      })
      result = await Bus.deleteGroupDevice(device)

      if (result.state !== 0) {
        Message.error(result.msg)
        return
      }

      Message.success('灌区删除成功')
      this.updateGroupListState()
    })
  }

  private async onNewGroupEvent (data: any) {
    // console.log(data);
    // 通过 group 下是否有name 字段 判断该项目是新建还是修改
    if (this.group.name) {
      // 修改灌区
      MessageBox.confirm('确定修改该灌区?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const willdelete = data.device.filter(
          (device: any) => 'id' in device && !('isExist' in device)
        )
        const willCreate = data.device.filter(
          (device: any) => !('id' in device)
        )
        let flag = true
        // console.log(willCreate, willdelete);

        for (let i = 0; i < willCreate.length; i++) {
          const item = willCreate[i]
          const device = {
            // id:0,
            create_time: new Date().getTime(),
            group_id: data.id,
            fac_id: item.facId,
            name: null,
            exp: item.exp,
            remark: null
          }
          const result = await Bus.createGroupDevice(device)
          if (result.state !== 0) {
            flag = false
            Message.error(result.msg)
          }
        }
        for (let i = 0; i < willdelete.length; i++) {
          const item = willdelete[i]
          const result = await Bus.deleteGroupDevice(item.id)
          if (result.state !== 0) {
            flag = false
            Message.error(result.msg)
          }
        }

        const group = {
          id: data.id,
          user_id: 1,
          name: data.name,
          crop_id: data.crop.id,
          machine_id: data.machine.fac_id,
          remark: null
        }
        const result = await Bus.updateGroup(group)
        if (result.state !== 0) {
          flag = false
          Message.error(result.msg)
        }

        if (flag) {
          this.addFlag = false
          this.updateGroupListState()
          Message.success('灌区修改成功')
        }
      })
    } else {
      // 新建灌区
      MessageBox.confirm('确定新建该灌区?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const group = {
          id: data.id,
          user_id: 1,
          name: data.name,
          create_time: new Date().getTime(),
          crop_id: data.crop.id,
          machine_id: data.machine.fac_id,
          remark: null
        }
        // console.log(group);
        let result = await Bus.createGroup(group)
        if (result.state === 0) {
          const device = data.device.map((device: any) => {
            return {
              // id:0,
              create_time: new Date().getTime(),
              group_id: result.data,
              fac_id: device.facId,
              name: null,
              exp: device.exp,
              remark: null
            }
          })
          let flag = true
          for (let i = 0; i < device.length; i++) {
            const item = device[i]
            result = await Bus.createGroupDevice(item)
            if (result.state !== 0) {
              flag = false
              Message.error(result.msg)
            }
          }
          if (flag) {
            Message.success('灌区建立成功')
            this.updateGroupListState()
            this.addFlag = false
          }
        } else {
          Message.error(result.msg)
        }
      })
    }
  }

  private async updateGroupListState () {
    Promise.all([Bus.getGroup(), Bus.getGroupDevice()]).then(
      (res: ResponedInterface[]) => {
        if (res[0].state === 0) {
          this.saveGroup(res[0].data)
        } else {
          Message.warning(res[0].type + '-' + res[0].msg)
        }
        if (res[1].state === 0) {
          this.saveGroupDevice(res[1].data)
        } else {
          Message.warning(res[1].type + '-' + res[1].msg)
        }
        // this.updateGroupList();
      }
    )
  }

  // private updateGroupList() {
  //   const getGroupDevice = (groupId: number) => {
  //     const groupDeviceList = this.GroupDevice.filter(
  //       (item: GroupDevice) => item.group_id === groupId
  //     );

  //     return groupDeviceList.map((item: GroupDevice) => {
  //       const device = <any>(
  //         this.deviceList.find(
  //           (device: DeviceInterface) => device.fac_id === item.fac_id
  //         )
  //       );
  //       return {
  //         id: item.id,
  //         facId: item.fac_id,
  //         facName: item.name || device.fac_name,
  //         exp: item.exp,
  //         group: item,
  //         device
  //       };
  //     });
  //   };
  //   const getGroupMachine = (machineId: number) => {
  //     const machine = <any>(
  //       this.deviceList.find(
  //         (device: DeviceInterface) => device.fac_id === machineId
  //       )
  //     );
  //     return {
  //       facName: machine.fac_name,
  //       facId: machine.fac_id,
  //       device: machine,
  //       exp: null
  //     };
  //   };
  //   this.groups = this.Group.map((item: UserGroup) => {
  //     return {
  //       id: item.id,
  //       userId: item.user_id,
  //       name: item.name,
  //       createTime: item.create_time,
  //       crop: this.Crop.find((crop: Crop) => crop.id === item.crop_id),
  //       machine: this.deviceList.find(
  //         (device: DeviceInterface) => device.fac_id === item.machine_id
  //       ),
  //       device: getGroupDevice(item.id)
  //     };
  //   });
  //   // console.log(this.groups);
  // }

  private get getCurrentDeviceList () {
    const deviceWithoutMachine = this.deviceList.filter(
      (device: DeviceInterface) =>
        device.fac_type.id !== 4 && device.fac_type.id !== 5
    )

    // 将网关下的子设备，分开
    const add: DeviceInterface[] = []
    deviceWithoutMachine.forEach((device: DeviceInterface, index: number) => {
      // console.log(device);
      if (device.fac_type.id === 6) {
        device.relay.forEach((relay: RelayInfoInterface) => {
          const tmp = JSON.parse(JSON.stringify(device))
          tmp.relay = [relay]
          add.push(tmp)
          // console.log(tmp, add);
        })
        deviceWithoutMachine.splice(index, 1)
      }
    })
    deviceWithoutMachine.splice(deviceWithoutMachine.length, 0, ...add)

    // 去除水肥机和已经选入灌区的设备
    const deviceRemaining = deviceWithoutMachine.filter(
      (device: DeviceInterface) => {
        const result = this.groups.map((group: any) => {
          return group.device.some(
            (dev: any) =>
              dev.facId === device.fac_id &&
              device.relay.some(
                (relay: RelayInfoInterface) => relay.index === dev.exp
              )
          )
        })

        return !result.some(value => value)
      }
    )
    // console.log(deviceWithoutMachine, deviceRemaining);
    return deviceRemaining
  }

  private get getCurrentMachineList () {
    return this.deviceList.filter(
      (device: DeviceInterface) =>
        device.fac_type.id === 4 || device.fac_type.id === 5
    )
  }

  // private get getGroupDeviceName () {}

  @Watch('GroupList', { immediate: true, deep: true })
  private getGroups (value: GroupInterface) {
    this.groups = JSON.parse(JSON.stringify(this.GroupList))
    console.log(this.groups)
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

<style lang="scss">
.group {
  .row {
    .el-card__header {
      padding: 0.09rem !important;
    }
    .el-scrollbar__wrap {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }
  }
}
</style>
