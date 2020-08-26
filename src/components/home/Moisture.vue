<template>
  <div>
    <div>
      <p>名称:{{ name }}</p>
      <p>编号:{{ id }}</p>
      <p>{{ datas[0].datetime }}</p>
    </div>
    <div>
      <el-tag v-for="data in datas" :key="data.eKey">
        {{ data.eName }}:{{ data.eValue }} {{ data.eUnit }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tag } from 'element-ui'

Vue.use(Tag)

@Component
export default class Moisture extends Vue {
  private id = 16066682;
  private name = '土壤墒情导管';
  private datas = [
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: 'V',
      eValue: '10.782',
      eKey: 'e1',
      eName: '电压',
      eNum: '124'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '%RH',
      eValue: '0.0',
      eKey: 'e2',
      eName: '土湿1',
      eNum: '107'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '℃',
      eValue: '29.8',
      eKey: 'e3',
      eName: '土温1',
      eNum: '106'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '%RH',
      eValue: '0.0',
      eKey: 'e4',
      eName: '土湿2',
      eNum: '107'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '℃',
      eValue: '29.8',
      eKey: 'e5',
      eName: '土温2',
      eNum: '106'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '%RH',
      eValue: '0.0',
      eKey: 'e6',
      eName: '土湿3',
      eNum: '107'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '℃',
      eValue: '29.6',
      eKey: 'e7',
      eName: '土温3',
      eNum: '106'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '%RH',
      eValue: '0.0',
      eKey: 'e8',
      eName: '土湿4',
      eNum: '107'
    },
    {
      datetime: '2020-06-09 14:47:12',
      eUnit: '℃',
      eValue: '29.4',
      eKey: 'e9',
      eName: '土温4',
      eNum: '106'
    }
  ];
}
</script>

<style lang="scss" scoped></style>
