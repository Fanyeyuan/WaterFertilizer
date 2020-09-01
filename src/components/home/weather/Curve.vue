<template>
  <div class="curve">
    <div class="container" ref="curve"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts"); // eslint-disable-line
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

@Component
export default class Curve extends Vue {
  private history = [
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:38:00',
      e1: 349,
      e2: 128,
      e3: 372,
      e4: 454,
      e5: 949,
      e6: 469,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:37:00',
      e1: 349,
      e2: 128,
      e3: 373,
      e4: 450,
      e5: 992,
      e6: 471,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:36:09',
      e1: 349,
      e2: 128,
      e3: 374,
      e4: 451,
      e5: 1028,
      e6: 471,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:34:59',
      e1: 349,
      e2: 128,
      e3: 375,
      e4: 446,
      e5: 1095,
      e6: 470,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:34:00',
      e1: 348,
      e2: 128,
      e3: 377,
      e4: 447,
      e5: 1176,
      e6: 473,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:33:00',
      e1: 349,
      e2: 128,
      e3: 378,
      e4: 446,
      e5: 1313,
      e6: 470,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:32:00',
      e1: 350,
      e2: 128,
      e3: 378,
      e4: 446,
      e5: 1450,
      e6: 466,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:30:59',
      e1: 347,
      e2: 128,
      e3: 379,
      e4: 443,
      e5: 1551,
      e6: 465,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:30:00',
      e1: 349,
      e2: 128,
      e3: 379,
      e4: 438,
      e5: 1664,
      e6: 465,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    },
    {
      facId: 16062693,
      dataTime: '2020-08-19 10:29:00',
      e1: 350,
      e2: 128,
      e3: 379,
      e4: 438,
      e5: 1749,
      e6: 467,
      e7: 32767,
      e8: 32767,
      e9: 32767,
      e10: 32767,
      e11: 32767,
      e12: 32767,
      e13: 32767,
      e14: 32767,
      e15: 32767,
      e16: 32767,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      j8: 0,
      j9: 0,
      j10: 0,
      j11: 0,
      j12: 0,
      j13: 0,
      j14: 0,
      j15: 0,
      j16: 0,
      j17: 0,
      j18: 0,
      j19: 0,
      j20: 0,
      j21: 0,
      j22: 0,
      j23: 0,
      j24: 0,
      j25: 0,
      j26: 0,
      j27: 0,
      j28: 0,
      j29: 0,
      j30: 0,
      j31: 0,
      j32: 0
    }
  ];

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
    }
  ];

  @Ref('curve') private readonly curve!: HTMLDivElement;

  private chart: any = null;

  private paintChart () {
    const option = {
      title: {
        show: false
        // text: "系数模拟曲线"
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        left: 0,
        data: this.getLegend,
        orient: 'vertical',
        textStyle: {
          color: '#ffffff',
          fontSize: 10,
          lineHeight: 10,
          padding: 0
        }
      },
      grid: {
        left: '20%',
        right: '1%',
        top: 10,
        bottom: -15,
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: true,
        data: this.getXNames
        // inverse: true
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: '#409eff'
          }
        },
        splitLine: {
          lineStyle: {
            opacity: 0.5,
            color: ['#aaa', '#ddd'],
            type: 'dashed'
          }
        }
      },
      series: this.getYData
    }

    // 使用刚指定的配置项和数据显示图表。
    this.chart.setOption(option)
    console.log(option)
  }

  private get getXNames () {
    const result = this.history.map(item => item.dataTime)
    console.log(result)
    return result
  }

  private get getYData () {
    const data = []
    for (let i = 1; i <= 6; i++) {
      const tmp = this.history.map((item: any) => item['e' + i])
      data.push(tmp)
    }
    const result = data.map((item, index) => {
      const unit = this.data.find(
        (item: any) => item.eKey === 'e' + (index + 1)
      )
      return {
        name: unit.eName,
        type: 'line',
        // stack: "总量",
        smooth: true,
        data: item
      }
    })
    console.log(result)
    return result
  }

  private get getLegend () {
    const result = this.data.map((item: any) => item.eName)
    console.log(result)
    return result
  }

  mounted () {
    this.chart = echarts.init(this.curve)
    // console.log(this.chart, this.curve);
    this.paintChart()
  }
}
</script>

<style lang="scss" scoped>
.curve {
  .container {
    height: 1.1rem;
    box-sizing: border-box;
    // height: 100%;
  }
}
</style>
