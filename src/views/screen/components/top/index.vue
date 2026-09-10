<template>
  <div class="top">
    <!-- 左侧：返回首页 -->
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <!-- 中间：大屏标题 -->
    <div class="center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
    </div>
    <!-- 右侧：统计报告 + 当前时间 -->
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()

// 格式化当前时间：YYYY年MM月DD日 HH:mm:ss
const formatTime = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 当前时间
let time = ref<string>(formatTime())
// 定时器 id
let timer = ref<number>(0)

// 组件挂载完毕：每秒更新一次时间
onMounted(() => {
  timer.value = window.setInterval(() => {
    time.value = formatTime()
  }, 1000)
})

// 组件卸载：清掉定时器，避免离开页面后还在跑
onBeforeUnmount(() => {
  clearInterval(timer.value)
})

// 回首页
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 100%;
  display: flex;

  // 左右两侧的装饰背景（课程素材 dataScreen-header-left-bg.png）
  .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;

    .lbtn {
      width: 130px;
      height: 40px;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 130px;
      height: 40px;
      float: left;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }

    .time {
      color: #29fcff;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>
