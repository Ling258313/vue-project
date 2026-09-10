<template>
  <div class="counter-box">
    <div class="title">
      <p>预约渠道数据统计</p>
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

// 各预约渠道的占比（合计 100，单位 %）
const channelData = [
  { value: 40, name: '智慧文旅平台' },
  { value: 10, name: '携程' },
  { value: 20, name: '飞猪' },
  { value: 30, name: '其他渠道' },
]

const option = {
  // 环形图配色
  color: ['#37a2da', '#4fd1c5', '#ffdb5c', '#ff8c42'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(50,50,50,0.7)',
    formatter: '{b}：{c}%',
  },
  // 图例带占比文字，例如：携程：10%
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    itemWidth: 14,
    itemHeight: 8,
    textStyle: { color: 'white', fontSize: 14 },
    formatter: (name: string) => {
      const item = channelData.find((it) => it.name === name)
      return name + '：' + (item ? item.value : 0) + '%'
    },
  },
  series: [
    {
      type: 'pie',
      // 环形：内外半径
      radius: ['45%', '68%'],
      center: ['32%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: 'rgba(10,30,60,0.6)',
        borderWidth: 2,
      },
      // 名称交给右侧图例展示，扇形上不再重复
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 6,
      },
      data: channelData,
    },
  ],
}

useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.counter-box {
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
