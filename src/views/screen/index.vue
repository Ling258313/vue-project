<template>
  <div class="container">
    <!-- 数据大屏内容区域：设计稿固定 1920×1080，用 scale 等比缩放到窗口 -->
    <div class="screen" ref="screenRef">
      <!-- 顶部 -->
      <div class="top">
        <Top />
      </div>
      <!-- 底部三栏（图表在后续小节接入） -->
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="counter"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
// 大屏顶部组件
import Top from './components/top/index.vue'
// 左侧：实时游客统计、男女比例、年龄比例
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 中间：中国地图 + 游客趋势
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
// 右侧：景区排行、年度游客量、数据统计
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

// 需要缩放的内容盒子
const screenRef = ref<HTMLDivElement>()

// 计算缩放比例：设计稿 1920×1080，取宽、高比例中较小的那个，
// 保证整屏内容都能完整显示且不变形（多余方向留黑边）
const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

// 应用缩放：transform-origin 为 left top，配合 translate(-50%, -50%) 实现居中
const setScale = () => {
  if (!screenRef.value) return
  screenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

onMounted(() => {
  setScale()
  // 视口变化时重新计算（用 addEventListener，组件卸载时可移除）
  window.addEventListener('resize', setScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setScale)
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // 大屏背景图（来自课程素材 images/bg.png）
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;
      margin-top: 10px;

      // 左、右两侧各放三个图表
      .left,
      .right {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
      }

      // 左栏：实时游客统计 / 男女比例 / 年龄分布
      .left {
        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      // 右栏：景区排行 / 年度游客量 / 数据统计
      .right {
        margin-left: 20px;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1;
        }
      }

      // 中间：中国地图 + 游客趋势折线图
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
