<template>
  <div
    class="curve"
    v-loading="!data.length"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="container" ref="curve"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'

import { namespace } from 'vuex-class'
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts"); // eslint-disable-line
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
const pageModule = namespace('page')

@Component
export default class Curve extends Vue {
  @pageModule.State('weather') private weather!: {
    history: any[];
    real: any[];
  };

  @pageModule.State(state => state.weather.history) private history!: any[];
  @pageModule.State(state => state.weather.real) private data!: any[];

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
        // left: "5%",
        // top: 0,
        data: this.getLegend,
        // orient: "vertical",
        textStyle: {
          color: '#ffffff',
          fontSize: 10,
          lineHeight: 10,
          padding: 0
        }
      },
      grid: {
        left: '1%',
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
    // console.log(option);
  }

  private get getXNames () {
    const result = this.history.map(item => item.dataTime)
    // console.log(result);
    return result
  }

  private getValuePoint (value: string): number {
    const data = value.split('.')
    if (data.length > 1) {
      return data[1].length
    } else {
      return 0
    }
  }

  private get getYData () {
    const data = []
    // console.log(this.data);
    for (let i = 1; i <= 4; i++) {
      const tmp = this.history.map((item: any) => item['e' + i])
      data.push(tmp)
    }
    const result = data.map((item, index) => {
      const unit = this.data.find(
        (item: any) => item.eKey === 'e' + (index + 1)
      ) || { eName: '' }
      const point = this.getValuePoint(unit.eValue)
      return {
        name: unit.eName,
        type: 'line',
        // stack: "总量",
        smooth: true,
        data: item.map((value: number) => value / Math.pow(10, point))
      }
    })
    // console.log(result);
    return result
  }

  private get getLegend () {
    const result = this.data.map((item: any) => item.eName)
    // console.log(result);
    return result
  }

  @Watch('weather', { immediate: true, deep: true })
  private drawChart () {
    !!this.chart && this.paintChart()
  }

  private mounted () {
    this.chart = echarts.init(this.curve)
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.curve {
  .container {
    margin: 0 auto;
    // width: 50%;
    height: 1.1rem;
    box-sizing: border-box;
    // height: 100%;
  }
}
</style>
