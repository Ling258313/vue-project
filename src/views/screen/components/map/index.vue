<template>
  <div class="map-box" ref="mapRef"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 按需注册过的 echarts（core + 用到的图表/组件）
import echarts from '@/utils/echarts'
// 中国地图 GeoJSON 数据
import chinaJSON from './chaina.json'
import useEcharts from '@/hooks/useEcharts'

// 注册中国地图（注册一次，全局可用）
echarts.registerMap(
  'china',
  chinaJSON as Parameters<typeof echarts.registerMap>[1],
)

// 图表挂载节点
const mapRef = ref<HTMLDivElement>()

const option = {
  // 地图组件：负责画出中国地图的底图
  geo: {
    map: 'china',
    roam: true, // 允许鼠标缩放/拖拽
    left: 150,
    top: 150,
    right: 150,
    // 说明：课程代码里这里是 bootom（拼错了，实际没生效），
    // 这里直接不写 bottom，视觉效果与视频一致
    // 地图上的省份文字
    label: {
      show: true,
      color: 'white',
    },
    itemStyle: {
      // 每个省份多边形的渐变填充
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
      opacity: 0.8,
    },
    // 高亮（鼠标悬浮省份）效果
    emphasis: {
      itemStyle: {
        color: 'red',
      },
      label: {
        fontSize: 40,
      },
    },
  },
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      type: 'lines',
      // 航线数据：coords 为 [起点经纬度, 终点经纬度]
      data: [
        {
          coords: [
            [116.405285, 39.904989], // 北京
            [91.132212, 29.660361], // 拉萨
          ],
          lineStyle: {
            color: 'orange',
            width: 2,
          },
        },
        {
          coords: [
            [116.405285, 39.904989], // 北京
            [87.617733, 43.792818], // 乌鲁木齐
          ],
          lineStyle: {
            color: 'orange',
            width: 2,
          },
        },
      ],
      // 飞线特效：一个沿航线飞的小飞机
      effect: {
        show: true,
        symbol:
          'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
        color: 'red',
        symbolSize: 15,
        trailLength: 0,
        period: 6,
      },
      lineStyle: {
        color: '#fff',
        width: 1,
        opacity: 0.6,
        curveness: 0.2, // 航线弧度
      },
    },
  ],
}

useEcharts(mapRef, option)
</script>

<style scoped></style>
