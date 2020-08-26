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

export interface ChannelInfoInterface {
  name: string;
  ele: Element;
  status?: number;
}

@Component
export default class ChannelInfo extends Vue {
  @Prop({ type: Array, default: () => [] })
  private value!: ChannelInfoInterface[];

  private channel!: ChannelInfoInterface[];
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

  private elementTypes = [
    { id: 4, indexs: 100, name: '未定义', unit: '-', min: 0, max: 10, prec: 1 },
    {
      id: 5,
      indexs: 101,
      name: '大气温度',
      unit: '℃',
      min: '-50',
      max: 100,
      prec: 0.1
    },
    {
      id: 6,
      indexs: 102,
      name: '大气湿度',
      unit: '%RH',
      min: 0,
      max: 100,
      prec: 0.1
    },
    {
      id: 7,
      indexs: 103,
      name: '模拟气压',
      unit: 'hPa',
      min: 500,
      max: 1500,
      prec: 0.1
    },
    {
      id: 8,
      indexs: 104,
      name: '雨量',
      unit: 'mm',
      min: 0,
      max: 100,
      prec: 0.1
    },
    {
      id: 9,
      indexs: 105,
      name: '简易总辐射',
      unit: 'W/m2',
      min: 0,
      max: 1500,
      prec: 1
    },
    {
      id: 10,
      indexs: 106,
      name: '土壤温度',
      unit: '℃',
      min: '-50',
      max: 100,
      prec: 0.1
    },
    {
      id: 11,
      indexs: 107,
      name: '土壤湿度',
      unit: '%RH',
      min: 0,
      max: 100,
      prec: 0.1
    },
    {
      id: 12,
      indexs: 108,
      name: '风速',
      unit: 'm/s',
      min: 0,
      max: 70,
      prec: 0.1
    },
    { id: 13, indexs: 109, name: '风向', unit: '°', min: 0, max: 360, prec: 1 },
    {
      id: 14,
      indexs: 110,
      name: '蒸发',
      unit: 'mm',
      min: 0,
      max: 1000,
      prec: 0.1
    },
    {
      id: 15,
      indexs: 111,
      name: '雪量',
      unit: 'mm',
      min: 0,
      max: 1000,
      prec: 1
    },
    {
      id: 16,
      indexs: 112,
      name: '照度',
      unit: 'Lux',
      min: 0,
      max: 200000,
      prec: 10
    },
    {
      id: 17,
      indexs: 113,
      name: '日照时数',
      unit: 'h',
      min: 0,
      max: 24,
      prec: 0.1
    },
    {
      id: 18,
      indexs: 114,
      name: '光合',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 19,
      indexs: 115,
      name: '雨量累计',
      unit: 'mm',
      min: 0,
      max: 6000,
      prec: 0.1
    },
    {
      id: 20,
      indexs: 116,
      name: '辐射累计',
      unit: 'MJ/m2',
      min: 0,
      max: 1000,
      prec: 0.01
    },
    {
      id: 21,
      indexs: 117,
      name: '有无雨雪',
      unit: '',
      min: 0,
      max: 1,
      prec: 1
    },
    {
      id: 22,
      indexs: 118,
      name: '噪声',
      unit: 'dB',
      min: 0,
      max: 100,
      prec: 0.1
    },
    {
      id: 23,
      indexs: 119,
      name: '水位',
      unit: 'cm',
      min: 0,
      max: 10000,
      prec: 0.1
    },
    {
      id: 24,
      indexs: 120,
      name: '二氧化碳',
      unit: 'PPM',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 25,
      indexs: 121,
      name: '曝辐量',
      unit: 'cal/cm2',
      min: 0,
      max: 3,
      prec: 1
    },
    {
      id: 26,
      indexs: 122,
      name: '液位',
      unit: 'mm',
      min: 0,
      max: 1000,
      prec: 0.1
    },
    {
      id: 27,
      indexs: 123,
      name: '光合有效辐射',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 28,
      indexs: 124,
      name: '电压',
      unit: 'V',
      min: 0,
      max: 15,
      prec: 0.001
    },
    {
      id: 29,
      indexs: 125,
      name: '紫外线',
      unit: 'mW/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 30,
      indexs: 126,
      name: '粉尘',
      unit: 'ug/m3',
      min: 0,
      max: 4,
      prec: 0.1
    },
    {
      id: 31,
      indexs: 127,
      name: '数字气压',
      unit: 'hPa',
      min: 10,
      max: 1100,
      prec: 0.1
    },
    {
      id: 32,
      indexs: 142,
      name: '电流',
      unit: 'mA',
      min: 0,
      max: 5000,
      prec: 0.1
    },
    {
      id: 33,
      indexs: 129,
      name: '最大风速',
      unit: 'm/s',
      min: 0,
      max: 70,
      prec: 0.1
    },
    {
      id: 36,
      indexs: 130,
      name: '平均风速',
      unit: 'm/s',
      min: 0,
      max: 70,
      prec: 0.1
    },
    {
      id: 37,
      indexs: 131,
      name: '经度',
      unit: '°',
      min: '-180',
      max: 180,
      prec: 0.1
    },
    {
      id: 38,
      indexs: 132,
      name: '纬度',
      unit: '°',
      min: '-90',
      max: 90,
      prec: 0.1
    },
    {
      id: 39,
      indexs: 133,
      name: '海拔高度',
      unit: 'm',
      min: '-2000',
      max: 9000,
      prec: 0.1
    },
    {
      id: 40,
      indexs: 134,
      name: 'TBQ总辐射',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 41,
      indexs: 135,
      name: '直接辐射',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 42,
      indexs: 136,
      name: '散射辐射',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 43,
      indexs: 138,
      name: '紫外辐射',
      unit: 'W/m2',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 44,
      indexs: 139,
      name: '贴片温度',
      unit: '℃',
      min: '-50',
      max: 100,
      prec: 0.1
    },
    {
      id: 45,
      indexs: 140,
      name: '露点温度',
      unit: '℃',
      min: '-50',
      max: 40,
      prec: 0.1
    },
    {
      id: 46,
      indexs: 141,
      name: '一氧化碳',
      unit: 'PPM',
      min: 0,
      max: 1000,
      prec: 1
    },
    {
      id: 47,
      indexs: 128,
      name: 'pH值',
      unit: '',
      min: 0,
      max: 14,
      prec: 0.01
    },
    {
      id: 48,
      indexs: 143,
      name: '超声波风速',
      unit: 'm/s',
      min: 0,
      max: 60,
      prec: 0.01
    },
    {
      id: 49,
      indexs: 144,
      name: '水温',
      unit: '℃',
      min: '-50',
      max: 100,
      prec: 0.1
    },
    {
      id: 50,
      indexs: 145,
      name: 'PM2.5',
      unit: 'ug/m3',
      min: 0,
      max: 10,
      prec: 0.1
    },
    {
      id: 51,
      indexs: 146,
      name: 'PM10',
      unit: 'ug/m3',
      min: 0,
      max: 10,
      prec: 0.1
    },
    {
      id: 52,
      indexs: 152,
      name: '能见度',
      unit: ' m',
      min: 0,
      max: 50000,
      prec: 0.1
    },
    {
      id: 53,
      indexs: 147,
      name: 0.1,
      unit: ' ',
      min: 0,
      max: 10000,
      prec: 0.1
    },
    {
      id: 54,
      indexs: 148,
      name: 0.01,
      unit: ' ',
      min: 0,
      max: 10000,
      prec: 0.01
    },
    {
      id: 55,
      indexs: 149,
      name: 0.001,
      unit: ' ',
      min: 0,
      max: 10000,
      prec: 0.001
    },
    {
      id: 56,
      indexs: 150,
      name: 'PM2.5',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 57,
      indexs: 151,
      name: 'PM10',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 58,
      indexs: 153,
      name: '负氧离子',
      unit: '个',
      min: 0,
      max: 5000,
      prec: 10
    },
    {
      id: 59,
      indexs: 154,
      name: '盐分',
      unit: 'mg/L',
      min: 0,
      max: 15000,
      prec: 1
    },
    {
      id: 60,
      indexs: 155,
      name: '电导率',
      unit: 'mS/cm',
      min: 0,
      max: 20,
      prec: 0.01
    },
    {
      id: 61,
      indexs: 156,
      name: 'SO2',
      unit: 'ug/m3',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 62,
      indexs: 157,
      name: 'CO',
      unit: 'mg/m3',
      min: 0,
      max: 2000,
      prec: 0.01
    },
    {
      id: 63,
      indexs: 158,
      name: 'NO2',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 64,
      indexs: 159,
      name: 'O3',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 65,
      indexs: 160,
      name: '管道流量',
      unit: 'm3/s',
      min: 0,
      max: 1000,
      prec: 0.01
    },
    {
      id: 66,
      indexs: 161,
      name: '流速',
      unit: 'L/min',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 67,
      indexs: 162,
      name: '管道压力',
      unit: 'KPa',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 68,
      indexs: 163,
      name: '温差',
      unit: '℃',
      min: '-150',
      max: 150,
      prec: 0.1
    },
    {
      id: 69,
      indexs: 164,
      name: '溶解氧',
      unit: 'mg/L',
      min: 0,
      max: 20,
      prec: 0.01
    },
    {
      id: 70,
      indexs: 165,
      name: '溶解氧差',
      unit: 'mg/L',
      min: '-20',
      max: 20,
      prec: 0.01
    },
    {
      id: 71,
      indexs: 166,
      name: '氨氮',
      unit: 'mg/L',
      min: 0,
      max: 2000,
      prec: 0.1
    },
    {
      id: 72,
      indexs: 167,
      name: '负氧离子',
      unit: '个',
      min: 0,
      max: 50000,
      prec: 1
    },
    {
      id: 73,
      indexs: 168,
      name: 'TSP',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 74,
      indexs: 169,
      name: '水位',
      unit: 'm',
      min: 0,
      max: 300,
      prec: 0.01
    },
    {
      id: 75,
      indexs: 170,
      name: '浊度',
      unit: ' npu',
      min: 0,
      max: 20,
      prec: 0.1
    },
    {
      id: 76,
      indexs: 171,
      name: 0.016,
      unit: ' ',
      min: 0,
      max: 1000,
      prec: 0.016
    },
    {
      id: 77,
      indexs: 172,
      name: 0.019,
      unit: ' ',
      min: 0,
      max: 1000,
      prec: 0.019
    },
    { id: 78, indexs: 173, name: 0.2, unit: ' ', min: 0, max: 1000, prec: 0.2 },
    { id: 79, indexs: 174, name: 0.3, unit: ' ', min: 0, max: 1000, prec: 0.3 },
    { id: 80, indexs: 175, name: 0.5, unit: ' ', min: 0, max: 1000, prec: 0.5 },
    { id: 81, indexs: 176, name: 0.7, unit: ' ', min: 0, max: 1000, prec: 0.7 },
    { id: 82, indexs: 177, name: 0.8, unit: ' ', min: 0, max: 1000, prec: 0.8 },
    { id: 83, indexs: 178, name: 0.9, unit: ' ', min: 0, max: 1000, prec: 0.9 },
    {
      id: 84,
      indexs: 179,
      name: 0.022,
      unit: ' ',
      min: 0,
      max: 1000,
      prec: 0.022
    },
    {
      id: 85,
      indexs: 180,
      name: 0.025,
      unit: ' ',
      min: 0,
      max: 1000,
      prec: 0.025
    },
    {
      id: 86,
      indexs: 181,
      name: 'SO2',
      unit: 'ppb',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 87,
      indexs: 182,
      name: 'CO',
      unit: 'ppb',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 88,
      indexs: 183,
      name: 'NO2',
      unit: 'ppb',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 89,
      indexs: 184,
      name: 'O3',
      unit: 'ppb',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 90,
      indexs: 185,
      name: 'NH3',
      unit: 'ppm',
      min: 0,
      max: 5000,
      prec: 0.01
    },
    {
      id: 91,
      indexs: 186,
      name: 'H2S',
      unit: 'ppm',
      min: 0,
      max: 5000,
      prec: 0.01
    },
    {
      id: 92,
      indexs: 187,
      name: '氧气',
      unit: '%Vol',
      min: 0,
      max: 1000,
      prec: 0.1
    },
    {
      id: 93,
      indexs: 188,
      name: '声波液位',
      unit: 'mm',
      min: 0,
      max: 30000,
      prec: 0.4
    },
    {
      id: 94,
      indexs: 189,
      name: '5min-PM25',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    {
      id: 95,
      indexs: 191,
      name: '水位',
      unit: 'm',
      min: 0,
      max: 10000,
      prec: 0.1
    },
    {
      id: 96,
      indexs: 190,
      name: '5min-PM10',
      unit: 'ug/m3',
      min: 0,
      max: 2000,
      prec: 1
    },
    { id: 97, indexs: 192, name: '归零', unit: 0, min: 0, max: 0, prec: 0 },
    {
      id: 98,
      indexs: 193,
      name: 'CO',
      unit: 'mg/m3',
      min: 0,
      max: 2000,
      prec: 0.1
    },
    {
      id: 99,
      indexs: 194,
      name: 'CH4',
      unit: '%LEL',
      min: 0,
      max: 100,
      prec: 0.1
    },
    {
      id: 100,
      indexs: 195,
      name: 'CH4S',
      unit: 'mg/m3',
      min: 0,
      max: 2000,
      prec: 0.001
    },
    {
      id: 101,
      indexs: 196,
      name: '能见度',
      unit: 'm',
      min: 0,
      max: 60000,
      prec: 1
    },
    {
      id: 102,
      indexs: 197,
      name: 0.105,
      unit: '℃',
      min: '-500',
      max: 10000,
      prec: 0.105
    },
    {
      id: 103,
      indexs: 198,
      name: '土壤盐分',
      unit: '',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 104,
      indexs: 199,
      name: '累积流量',
      unit: 'm3',
      min: 0,
      max: 60000,
      prec: 0.01
    },
    {
      id: 105,
      indexs: 200,
      name: '菌落总数',
      unit: 'CFU',
      min: 0,
      max: 800,
      prec: 1
    },
    {
      id: 106,
      indexs: 201,
      name: '土壤热通量',
      unit: 'w/m2',
      min: '-500',
      max: 500,
      prec: 0.1
    },
    {
      id: 107,
      indexs: 202,
      name: '液位',
      unit: 'mm',
      min: 0,
      max: 5000,
      prec: 1
    },
    {
      id: 108,
      indexs: 203,
      name: '液位',
      unit: 'mm',
      min: 0,
      max: 20000,
      prec: 1
    },
    {
      id: 109,
      indexs: 204,
      name: '氨氮',
      unit: 'ppm',
      min: 0,
      max: 300,
      prec: 0.1
    },
    {
      id: 110,
      indexs: 205,
      name: '1.2PM',
      unit: 'ug',
      min: 0,
      max: 1000,
      prec: 1.2
    },
    {
      id: 111,
      indexs: 206,
      name: '1.5PM',
      unit: 'ug',
      min: 0,
      max: 1000,
      prec: 1.5
    },
    {
      id: 112,
      indexs: 207,
      name: '毫米汞柱',
      unit: 'mmHg',
      min: 0,
      max: 2000,
      prec: 0.1
    },
    {
      id: 113,
      indexs: 208,
      name: '照度',
      unit: 'Lux',
      min: 0,
      max: 200000,
      prec: 1
    },
    {
      id: 114,
      indexs: 209,
      name: '电压',
      unit: 'V',
      min: 0,
      max: 100000,
      prec: 0.1
    },
    {
      id: 115,
      indexs: 210,
      name: '电流',
      unit: 'A',
      min: 0,
      max: 100000,
      prec: 0.1
    },
    {
      id: 116,
      indexs: 211,
      name: 'ORP',
      unit: 'mV',
      min: '-10000',
      max: 10000,
      prec: 0.01
    },
    {
      id: 117,
      indexs: 212,
      name: '电压',
      unit: 'V',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 118,
      indexs: 213,
      name: '电流',
      unit: 'A',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 119,
      indexs: 214,
      name: '功率',
      unit: 'W',
      min: 0,
      max: 10000,
      prec: 1
    },
    {
      id: 120,
      indexs: 215,
      name: '流量',
      unit: 'm3/h',
      min: 0,
      max: 10000,
      prec: 0.01
    },
    {
      id: 121,
      indexs: 216,
      name: '累计流量',
      unit: 'm3',
      min: 0,
      max: 30000,
      prec: 1
    }
  ];

  @Emit('input')
  private onInfoChange () {
    return this.channel
  }

  private onColumnClick (row: ChannelInfoInterface) {
    row.status = 1 - row.status
    row.status || this.onInfoChange()
  }

  @Watch('value', { immediate: true, deep: true })
  private infoChange (value: ChannelInfoInterface[]) {
    this.channel = JSON.parse(JSON.stringify(value))
    for (let i = this.channel.length + 1; i <= 16; i++) {
      const data = JSON.parse(JSON.stringify(this.defaultChannelInfo))
      this.channel.push(data)
    }
  }

  private mounted () {
    // for (let i = 1; i <= 16; i++) {
    //   let data = JSON.parse(JSON.stringify(this.defaultChannelInfo));
    //   data.code = "CH" + i;
    //   this.channel.push(data);
    // }
  }
}
</script>

<style scoped></style>
