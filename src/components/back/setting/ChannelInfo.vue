<template>
  <el-table
    style="width: 100%;"
    :data="channel"
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
        <span>{{ "CH" + (scope.$index + 1) }}</span>
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
          v-if="!!scope.row.status"
          v-model="scope.row.name"
          placeholder="请输入设备名称"
          @change="onRowChange"
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
        <span>要素</span>
        <i
          class="el-icon-edit-outline"
          style="color:#409eff;margin-left:5px;"
        ></i>
      </template>
      <template slot-scope="scope">
        <el-select
          v-model="scope.row.ele"
          size="small"
          placeholder="请选择要素"
          v-if="!!scope.row.status"
          value-key="id"
          @change="onRowChange"
        >
          <el-option
            :label="item.name"
            :value="item"
            v-for="item in elementTypes"
            :key="item.id"
          ></el-option>
        </el-select>
        <span v-else>{{ scope.row.ele.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ele"
      align="center"
      header-align="center"
      label="最小值"
      width="80"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.ele.min }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ele"
      align="center"
      header-align="center"
      label="最大值"
      width="80"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.ele.max }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ele"
      align="center"
      header-align="center"
      label="分辨率"
      width="80"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.ele.prec }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ele"
      align="center"
      header-align="center"
      label="单位"
      width="80"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.ele.unit }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { Element } from '@/app/main/database/model'

import { namespace } from 'vuex-class'
const databaseModule = namespace('database')

export interface ChannelInfoInterface {
  name: string;
  ele: Element;
  status?: number;
}

@Component
export default class ChannelInfo extends Vue {
  @databaseModule.State('Element') private elementTypes!: Element[];

  @Prop({ type: Array, default: () => [] })
  private value!: ChannelInfoInterface[];

  private channel: ChannelInfoInterface[] = [];
  private defaultChannelInfo: ChannelInfoInterface = {
    name: '-',
    ele: {
      id: 4,
      indexs: '100',
      name: '未定义',
      unit: '-',
      min: 0,
      max: 10,
      prec: 1
    },
    status: 0
  };

  @Emit('input')
  private onInfoChange () {
    return this.channel
  }

  private onRowChange () {
    this.onInfoChange()
  }

  private onColumnClick (row: ChannelInfoInterface) {
    this.channel.forEach((value: ChannelInfoInterface) => {
      if (value !== row) value.status = 0
    })
    row.status = 1 - (row.status || 0)
    // row.status || this.onInfoChange();
    // console.log(row);
  }

  @Watch('value', { immediate: true, deep: true })
  private infoChange (value: ChannelInfoInterface[]) {
    let flag = false
    this.channel = JSON.parse(JSON.stringify(value))
    for (let i = this.channel.length + 1; i <= 16; i++) {
      const data = JSON.parse(JSON.stringify(this.defaultChannelInfo))
      this.channel.push(data)
      flag = true
    }
    flag && this.onInfoChange()
  }

  // private mounted () {}
}
</script>

<style scoped></style>
