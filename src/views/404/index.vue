<template>
  <div class="not-found">
    <!-- 背景装饰：两朵慢慢飘动的云 -->
    <img
      class="cloud cloud-1"
      src="../../assets/images/error_images/cloud.png"
      alt=""
    />
    <img
      class="cloud cloud-2"
      src="../../assets/images/error_images/cloud.png"
      alt=""
    />

    <div class="content">
      <!-- 左侧插画：白底卡片，暗黑模式下也不会和背景糊在一起 -->
      <div class="pic-card">
        <img
          class="pic"
          src="../../assets/images/error_images/404.png"
          alt="404"
        />
      </div>

      <!-- 右侧文案与操作 -->
      <div class="info">
        <p class="code">404</p>
        <h2 class="title">页面走丢了</h2>
        <p class="desc">
          抱歉，你访问的页面不存在。它可能已被删除、改了名字，或者你输入的地址有误。
        </p>
        <p class="path" v-if="fromPath">
          <el-icon><Link /></el-icon>
          <span>{{ fromPath }}</span>
        </p>
        <div class="actions">
          <el-button type="primary" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            <span>返回首页</span>
          </el-button>
          <el-button @click="goBack">
            <el-icon><Back /></el-icon>
            <span>返回上一页</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, HomeFilled, Link } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 被拦截的原始地址：catch-all 路由跳转时会以 query 的形式带过来
const fromPath = computed(() => {
  const from = route.query.from
  return typeof from === 'string' ? decodeURIComponent(from) : ''
})

// 回首页
const goHome = () => {
  router.push('/home')
}

// 回上一页：没有历史记录时兜底回首页，避免点了没反应
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}
</script>

<style scoped lang="scss">
.not-found {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  // 跟随主题：亮色/暗黑模式自动切换
  background: var(--el-bg-color-page);

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 64px;
  }

  // 插画卡片
  .pic-card {
    flex-shrink: 0;
    padding: 16px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    animation: float 4s ease-in-out infinite;

    .pic {
      display: block;
      width: 440px;
      max-width: 100%;
    }
  }

  .info {
    max-width: 420px;

    .code {
      font-size: 64px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 12px;
      // 主题色渐变文字
      background: linear-gradient(
        135deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    .title {
      font-size: 26px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;
    }

    .desc {
      font-size: 14px;
      line-height: 1.8;
      color: var(--el-text-color-regular);
      margin-bottom: 18px;
    }

    .path {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      padding: 6px 12px;
      margin-bottom: 24px;
      border-radius: 6px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 13px;
      word-break: break-all;
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  }

  // 云朵装饰
  .cloud {
    position: absolute;
    opacity: 0.75;
    user-select: none;
    pointer-events: none;
  }

  .cloud-1 {
    width: 120px;
    top: 14%;
    left: 8%;
    animation: drift 9s ease-in-out infinite;
  }

  .cloud-2 {
    width: 84px;
    right: 10%;
    bottom: 16%;
    animation: drift 11s ease-in-out infinite reverse;
  }
}

// 插画上下浮动
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

// 云朵左右飘动
@keyframes drift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(24px);
  }
}

// 窄屏改为上下排版
@media (max-width: 900px) {
  .not-found {
    .content {
      flex-direction: column;
      gap: 32px;
      text-align: center;
    }

    .pic-card .pic {
      width: 300px;
    }

    .info {
      .path,
      .actions {
        justify-content: center;
      }
    }

    .cloud-1,
    .cloud-2 {
      display: none;
    }
  }
}
</style>
