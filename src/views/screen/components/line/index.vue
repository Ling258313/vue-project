<template>
  <div class="line-box">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
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

const option = {
  // 标题组件
  title: {
    text: '(访问量)',
  },
  xAxis: {
    type: 'category',
    // 两侧不留白
    boundaryGap: 0,
    splitLine: {
      show: false,
    },
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisTick: {
      show: true,
    },
  },
  yAxis: {
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
    },
    axisTick: {
      show: true,
    },
  },
  grid: {
    left: 40,
    top: 0,
    right: 0,
    bottom: 20,
  },
  series: [
    {
      type: 'line',
      data: [1, 240, 6, 100, 1, 200, 2],
      // 平滑曲线
      smooth: true,
      // 区域填充：从上到下的线性渐变
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'red' },
            { offset: 1, color: 'blue' },
          ],
          global: false,
        },
      },
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
