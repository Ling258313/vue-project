<template>
  <div class="line-box">
    <div class="title">
      <p>未来30天游客量趋势图</p>
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

// 未来 30 天的日期（MM/DD）：起点与课程素材保持一致
const startDate = new Date(2023, 4, 6)
const dayLabels = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return month + '/' + day
})

// 未来 30 天的访问量
const visitData = [
  9800, 11200, 12600, 10400, 13800, 15200, 14100, 12800, 11600, 13400, 15900,
  17200, 16400, 14800, 13600, 15200, 17800, 19500, 18600, 16900, 15400, 14200,
  15800, 18100, 20400, 21000, 19300, 17600, 16200, 14800,
]

const option = {
  // 左上角单位说明
  title: {
    text: '(访问量)',
    left: 10,
    top: 0,
    textStyle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)',
  },
  xAxis: {
    type: 'category',
    // 两侧不留白
    boundaryGap: 0,
    splitLine: { show: false },
    data: dayLabels,
    // 30 个日期太密，隔一个显示一个
    axisLabel: {
      interval: 1,
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
    },
    axisTick: { show: true },
  },
  yAxis: {
    // 最大值与刻度间隔和素材一致：0 ~ 2.1w
    max: 21000,
    interval: 3000,
    splitLine: { show: false },
    axisLine: { show: true },
    axisTick: { show: true },
    axisLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
      // 超过一万用 w 显示
      formatter: (value: number) =>
        value >= 10000 ? value / 10000 + 'w' : String(value),
    },
  },
  grid: {
    left: 44,
    top: 26,
    right: 16,
    bottom: 20,
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      data: visitData,
      // 平滑曲线
      smooth: true,
      symbol: 'none',
      // 区域填充：从上到下的线性渐变
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255,75,92,0.9)' },
            { offset: 1, color: 'rgba(30,111,255,0.15)' },
          ],
          global: false,
        },
      },
      lineStyle: { color: '#ff4b5c', width: 2 },
    },
  ],
}

useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.line-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;

  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
