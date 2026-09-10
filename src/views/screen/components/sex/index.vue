<template>
  <div class="sex-box">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="gender">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士60%</p>
      <p>女士40%</p>
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
  title: {
    text: '男女比例',
    textStyle: {
      color: 'skyblue',
    },
    left: '40%',
  },
  // x 轴不显示，只做数值刻度（0~100）
  xAxis: {
    show: false,
    min: 0,
    max: 100,
  },
  yAxis: {
    show: false,
    type: 'category',
  },
  series: [
    {
      type: 'bar',
      data: [60], // 男士
      barWidth: 20,
      z: 100,
      itemStyle: {
        color: '#007AFE',
        borderRadius: 20,
      },
    },
    {
      type: 'bar',
      data: [100], // 底条（女士 100%，用负间距叠在上面）
      barWidth: 20,
      barGap: '-100%',
      itemStyle: {
        color: '#FF4B7A',
        borderRadius: 20,
      },
    },
  ],
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
}

useEcharts(chartsRef, option)
</script>

<style scoped lang="scss">
.sex-box {
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

  .gender {
    display: flex;
    justify-content: center;

    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .charts {
    height: 100px;
  }
}
</style>
