<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <!-- 游客数：把一个一个字符拆开，各自用数字牌背景渲染 -->
    <div class="pepole-nomber">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts 水球图挂载节点 -->
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 水球图扩展插件（内部注册到同一份 echarts core，只需引入一次）
import 'echarts-liquidfill'
// 通用封装：自动 init / setOption / resize / dispose
import useEcharts from '@/hooks/useEcharts'

// 实时游客数
let people = ref<string>('216908人')
// 图表挂载节点
let chartsRef = ref<HTMLDivElement>()

// 水球图属于扩展系列，echarts 自带类型里没有 liquidFill / outline，这里用 any 承载配置
const option: any = {
  // 水球图不需要坐标系，但保留空配置（课程原样）
  xAxis: {},
  yAxis: {},
  // 系列：决定展示什么样的图形
  series: {
    type: 'liquidFill',
    data: [0.6], // 水位（0~1）
    waveAnimation: true, // 水波流动动画
    animationDuration: 3,
    animationDurationUpdate: 0,
    radius: '90%', // 半径
    outline: {
      show: true,
      borderDistance: 8,
      itemStyle: {
        color: 'none',
        borderColor: '#294D99',
        borderWidth: 8,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
      },
    },
  },
  // 布局：贴满容器
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}

// 交给 Hook 处理图表的生命周期
useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;
    margin-top: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    // 标题下方的小装饰条
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 15px;

      span {
        color: orange;
        font-style: italic;
      }
    }
  }

  .pepole-nomber {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 235px;
  }
}
</style>
