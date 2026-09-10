<template>
  <div class="age-box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useEcharts from '@/hooks/useEcharts'

// 图表挂载节点
const chartsRef = ref<HTMLDivElement>()

const option = {
  // 提示框：饼图用 item 触发
  tooltip: {
    trigger: 'item',
  },
  // 图例：竖排靠右
  legend: {
    top: '40px',
    right: '30px',
    orient: 'vertical',
    textStyle: {
      color: 'white',
      fontSize: 14,
    },
  },
  series: [
    {
      name: '年龄比例',
      type: 'pie',
      // 环形：内外半径
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'inside',
        color: 'white',
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: '军事' },
        { value: 735, name: '新闻' },
        { value: 580, name: '娱乐' },
        { value: 484, name: '财经' },
        { value: 300, name: '直播' },
      ],
    },
  ],
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}

useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.age-box {
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
    height: 260px;
  }
}
</style>
