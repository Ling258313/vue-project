<template>
  <div class="year-box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useEcharts from '@/hooks/useEcharts'

// 图表挂载节点
const chartsRef = ref<HTMLDivElement>()

// x 轴：1~12 月
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

// 三年客流数据（单位：万人）
const data2021 = [120, 180, 150, 220, 240, 280, 260, 300, 320, 280, 340, 380]
const data2022 = [180, 220, 260, 240, 320, 360, 340, 400, 380, 420, 460, 480]
const data2023 = [220, 300, 360, 320, 420, 480, 460, 520, 500, 540, 560, 600]

// 三年各自的折线颜色
const colors = ['#37a2da', '#ffdb5c', '#4fd1c5']

/**
 * 生成一条折线系列：平滑曲线 + 渐变面积
 * @param name  系列名（图例显示）
 * @param data  12 个月的数据
 * @param color 线条与面积颜色
 */
const buildSeries = (name: string, data: number[], color: string) => ({
  name,
  type: 'line',
  smooth: true,
  symbol: 'circle',
  symbolSize: 6,
  data,
  itemStyle: { color },
  lineStyle: { width: 2, color },
  areaStyle: {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: color },
        { offset: 1, color: 'rgba(0,0,0,0)' },
      ],
      global: false,
    },
  },
})

const option = {
  // 图例：2021年 / 2022年 / 2023年
  legend: {
    top: 0,
    right: 20,
    itemWidth: 14,
    itemHeight: 8,
    textStyle: { color: 'white', fontSize: 13 },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)',
  },
  grid: {
    left: 40,
    top: 34,
    right: 24,
    bottom: 24,
  },
  xAxis: {
    type: 'category',
    data: months,
    boundaryGap: false,
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
    axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  },
  yAxis: {
    // 单位
    name: '人数',
    nameTextStyle: { color: 'rgba(255,255,255,0.7)' },
    max: 600,
    interval: 100,
    axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: { color: 'rgba(255,255,255,0.15)', type: 'dashed' },
    },
  },
  series: [
    buildSeries('2021年', data2021, colors[0]),
    buildSeries('2022年', data2022, colors[1]),
    buildSeries('2023年', data2023, colors[2]),
  ],
}

useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.year-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
