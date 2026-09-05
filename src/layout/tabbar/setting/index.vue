<template>
  <div class="tabbar_right">
    <!-- 刷新 / 全屏 / 设置 按钮 -->
    <el-button
      type="primary"
      size="small"
      :icon="Refresh"
      circle
      @click="updateRefsh"
    ></el-button>
    <el-button
      type="primary"
      size="small"
      :icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>
    <el-button type="primary" size="small" :icon="Setting" circle></el-button>
    <!-- 头像：优先显示登录用户的头像，没有则用默认 logo -->
    <img
      :src="userStore.userInfo?.avatar || setting.logo"
      style="width: 24px; height: 24px; border-radius: 50%"
    />
    <!-- 下拉菜单 -->
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ userStore.userInfo?.name || 'admin' }}
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
//获取小仓库
import useLayoutSettingsStore from '@/store/moudules/settings'
let layoutsettingStore = useLayoutSettingsStore()
//引入用户小仓库（拿登录用户的信息）
import useUserStore from '@/store/moudules/user'
let userStore = useUserStore()
//刷新按钮点击的回调
const updateRefsh = () => {
  layoutsettingStore.refsh = !layoutsettingStore.refsh
}
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  }
}
import {
  Refresh,
  FullScreen,
  Setting,
  ArrowDown,
} from '@element-plus/icons-vue'
import setting from '@/setting'

// 引入路由（跳转登录页）
import { useRouter, useRoute } from 'vue-router'
let $router = useRouter()
let $route = useRoute()

// 下拉菜单点击回调：command 是点击项上的 command 值
const handleCommand = async (command: string) => {
  console.log('【追踪1】handleCommand 被触发，command =', command)
  if (command === 'logout') {
    // ① 通知后端登出 + 清空仓库中用户相关的数据（token、userInfo）和 localStorage
    console.log('【追踪2】开始执行 userLogout')
    await userStore.userLogout()
    console.log('【追踪3】退出后 userInfo =', userStore.userInfo) // 验证：应为 null
    // ③ 跳转到登录页面
    $router.push({ path: '/login', query: { redirect: $route.path } })
  }
}
</script>

<style scoped lang="scss">
.tabbar_right {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .el-dropdown-link {
    cursor: pointer;
    color: #090909;
    display: flex;
    align-items: center;
    outline: none;
  }
}
</style>
