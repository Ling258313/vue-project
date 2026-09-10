<template>
  <div class="map-box">
    <!-- 地图图表容器 -->
    <div class="map-charts" ref="mapRef"></div>
    <!-- 地图标题 -->
    <div class="map-title">
      <p>景区实时客流量</p>
    </div>
    <!-- 平台高峰预警信息 -->
    <div class="warn">
      <div class="warn-header">
        <p>
          平台高峰预警信息
          <span>（{{ warnList.length }}条）</span>
        </p>
      </div>
      <div class="warn-item" v-for="item in warnList" :key="item.text">
        <img src="../../images/dataScreen-alarm.png" alt="" />
        <p class="warn-text">{{ item.text }}</p>
        <p class="warn-time">{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 按需注册过的 echarts（core + 用到的图表/组件）
import echarts from '@/utils/echarts'
import useEcharts from '@/hooks/useEcharts'

// 图表挂载节点
const mapRef = ref<HTMLDivElement>()

// 高峰预警信息（真实项目里由接口下发）
const warnList = [
  { text: '峨眉山景区当前客流量已达今日上限', time: '09:20' },
  { text: '九寨沟景区预约量已满，请游客错峰出行', time: '14:35' },
]

const option = {
  // 地图组件：负责画出中国地图的底图
  geo: {
    map: 'china',
    roam: true, // 允许鼠标缩放/拖拽
    left: 150,
    top: 200,
    right: 150,
    // 说明：课程代码里写的是 bootom（拼错了，实际没写 bottom），
    // 这里补上 bottom，让地图在标题/预警信息下方的区域里垂直居中
    bottom: 0,
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

// 先初始化空图表：地图数据要等接口/文件回来才能注册
const { setOption } = useEcharts(mapRef, {})

onMounted(async () => {
  // GeoJSON 有 1MB 左右，放在 public 目录里按需请求，不打进 JS chunk
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'map/china.json')
    const geoJson = await res.json()
    // 注册中国地图（注册一次，全局可用）
    echarts.registerMap(
      'china',
      geoJson as Parameters<typeof echarts.registerMap>[1],
    )
    setOption(option)
  } catch (error) {
    console.error('中国地图数据加载失败：', error)
  }
})
</script>

<style scoped lang="scss">
.map-box {
  position: relative;
  width: 100%;
  height: 100%;

  .map-charts {
    width: 100%;
    height: 100%;
  }

  // 地图标题（用素材图做标题背景）
  .map-title {
    position: absolute;
    top: 6px;
    left: 10px;
    width: 520px;
    height: 50px;
    background: url(../../images/map-title-bg.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      color: white;
      font-size: 20px;
      letter-spacing: 2px;
    }
  }

  // 平台高峰预警信息
  .warn {
    position: absolute;
    top: 64px;
    left: 10px;
    width: 500px;

    .warn-header {
      height: 40px;
      padding-left: 24px;
      background: url(../../images/dataScreen-header-warn-bg.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;

      p {
        color: white;
        font-size: 16px;
        text-shadow: 0 0 6px rgba(0, 60, 120, 0.9);

        span {
          font-size: 13px;
        }
      }
    }

    .warn-item {
      height: 44px;
      margin-top: 8px;
      padding: 0 16px;
      background: url(../../images/dataScreen-warn-bg.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;

      img {
        width: 15px;
        height: 15px;
        margin-right: 8px;
      }

      .warn-text {
        flex: 1;
        color: white;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .warn-time {
        margin-left: 10px;
        color: rgba(255, 255, 255, 0.75);
        font-size: 12px;
      }
    }
  }
}
</style>
