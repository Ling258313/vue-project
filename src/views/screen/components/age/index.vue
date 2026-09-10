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

// 各年龄段占比（合计 100，单位 %）
const ageData = [
  { value: 16, name: '10岁以下' },
  { value: 8, name: '10-18岁' },
  { value: 12, name: '18-30岁' },
  { value: 24, name: '30-40岁' },
  { value: 20, name: '40-60岁' },
  { value: 20, name: '60岁以上' },
]

const option = {
  // 提示框：饼图用 item 触发
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(50,50,50,0.7)',
    formatter: '{b}：{c}%',
  },
  // 图例：竖排靠右，带上各自占比
  legend: {
    top: '40px',
    right: '20px',
    orient: 'vertical',
    itemWidth: 14,
    itemHeight: 8,
    textStyle: {
      color: 'white',
      fontSize: 14,
    },
    formatter: (name: string) => {
      const item = ageData.find((it) => it.name === name)
      return name + '：' + (item ? item.value : 0) + '%'
    },
  },
  color: ['#37a2da', '#4fd1c5', '#ffdb5c', '#ff8c42', '#ff6b81', '#9b8cff'],
  series: [
    {
      name: '年龄比例',
      type: 'pie',
      // 环形：内外半径
      radius: ['40%', '70%'],
      center: ['38%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      // 扇形上直接显示百分比
      label: {
        show: true,
        position: 'inside',
        color: 'white',
        formatter: '{d}%',
      },
      labelLine: {
        show: false,
      },
      data: ageData,
    },
  ],
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
