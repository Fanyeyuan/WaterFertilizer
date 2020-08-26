<template>
  <div class="real">
    <el-scrollbar :native="false">
      <el-row type="flex" :gutter="10">
        <el-col :span="8" v-for="(value, index) in data" :key="index">
          <div class="element">
            <div class="icon">
              <i class="el-icon-wind-power"></i>
            </div>
            <div>
              <span>{{ value.eValue }} {{ value.eUnit }}</span>
            </div>
            <div>
              <span>{{ value.eName }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { Scrollbar } from 'element-ui'
Vue.use(Scrollbar)

@Component
export default class Real extends Vue {
  private data = [
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: '℃',
      eValue: '34.4',
      eKey: 'e1',
      eName: '土壤温度',
      eNum: '106'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: '%RH',
      eValue: '12.8',
      eKey: 'e2',
      eName: '土壤湿度',
      eNum: '107'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: '℃',
      eValue: '39.1',
      eKey: 'e3',
      eName: '大气温度',
      eNum: '101'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: '%RH',
      eValue: '39.2',
      eKey: 'e4',
      eName: '大气湿度',
      eNum: '102'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'Lux',
      eValue: '31010',
      eKey: 'e5',
      eName: '照度',
      eNum: '112'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '468',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '468',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '468',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '468',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '468',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    },
    {
      datetime: '2020-08-19 09:46:59',
      eUnit: 'PPM',
      eValue: '469',
      eKey: 'e6',
      eName: '二氧化碳',
      eNum: '120'
    }
  ];
}
</script>

<style lang="scss" scoped>
.real {
  .element {
    margin-top: 0.02rem;
    text-align: center;
    color: #0af;
    .icon {
      margin: 0 auto;
      width: 0.7rem;
      height: 0.7rem;
      background: url("~@/assets/image/element_background.d25bba14.png")
        no-repeat;
      background-size: contain;

      i {
        font-size: 0.4rem;
        line-height: 0.7rem;
      }
    }
    span {
      font-size: 0.12rem;
    }
  }
  .el-scrollbar__wrap {
    overflow: hidden;
  }
}
</style>
