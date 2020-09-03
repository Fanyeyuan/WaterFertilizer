<template>
  <el-table
    style="width: 100%;"
    :data="relay"
    size="small"
    @row-dblclick="onColumnClick"
  >
    <el-table-column
      align="center"
      header-align="center"
      label="通道号"
      width="70"
    >
      <template slot-scope="scope">
        <span>{{ "CH" + (scope.$index + relayStartNumber) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      width="120"
      align="center"
      header-align="center"
    >
      <template slot="header">
        <span>名称</span>
        <i
          class="el-icon-edit-outline"
          style="color:#409eff;margin-left:5px;"
        ></i>
      </template>
      <template slot-scope="scope">
        <el-input
          size="small"
          v-if="scope.row.status"
          v-model="scope.row.name"
          placeholder="请输入设备名称"
        ></el-input>
        <span v-else>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ele"
      align="center"
      header-align="center"
      width="120"
    >
      <template slot="header">
        <span>类型</span>
        <i
          class="el-icon-edit-outline"
          style="color:#409eff;margin-left:5px;"
        ></i>
      </template>
      <template slot-scope="scope">
        <el-select
          v-model="scope.row.relay"
          size="small"
          placeholder="请选择类型"
          v-if="scope.row.status"
          value-key="id"
        >
          <el-option
            :label="item.name"
            :value="item"
            v-for="item in relayTypes"
            :key="item.id"
          ></el-option>
        </el-select>
        <span v-else>{{ scope.row.relay.name }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { Relay } from '@/app/main/database/model'

import { namespace } from 'vuex-class'
const databaseModule = namespace('database')

export interface RelayInfoInterface {
  index: number;
  name: string;
  relay: Relay;
  status?: number;
}

@Component
export default class RelayInfo extends Vue {
  @databaseModule.State('Relay') private relayTypes!: Relay[];

  @Prop({ type: Array, default: () => [] })
  private value!: RelayInfoInterface[];

  @Prop({ type: Number, default: 32 }) private relayNumber!: number;
  @Prop({ type: Number, default: 1 }) private relayStartNumber!: number;
  private relay!: RelayInfoInterface[];
  private defaultRelayInfo: RelayInfoInterface = {
    index: 0,
    name: '-',
    relay: {
      id: 0,
      indexs: 0,
      name: '-'
    },
    status: 0
  };

  @Emit('input')
  private onInfoChange () {
    return this.relay
  }

  private onColumnClick (row: RelayInfoInterface) {
    row.status = 1 - row.status
    row.status || this.onInfoChange()
  }

  @Watch('value', { immediate: true, deep: true })
  private infoChange (value: RelayInfoInterface[]) {
    this.relay = JSON.parse(JSON.stringify(value))
    console.log(this.relay)
    for (let i = this.relay.length; i < this.relayNumber; i++) {
      const data = JSON.parse(JSON.stringify(this.defaultRelayInfo))
      data.index = i
      this.relay.push(data)
    }
  }

  private mounted () {
    // for (let i = 1; i < 32; i++) {
    //   let data = JSON.parse(JSON.stringify(this.relay[0]));
    //   data.code = "JK" + (i + 1);
    //   // data.ele = this.elementTypes[i];
    //   // console.log(data);
    //   this.relay.push(data);
    // }
  }
}
</script>

<style scoped></style>
