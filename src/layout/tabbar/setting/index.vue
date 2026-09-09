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
    <!-- 设置按钮：悬浮弹出"主题设置"弹层（含暗黑模式开关） -->
    <el-popover
      placement="bottom"
      title="主题设置"
      :width="300"
      trigger="hover"
    >
      <el-form>
        <el-form-item label="主题颜色">
          <!-- teleported: false → 颜色面板渲染在 popover 内部，点面板时 popover 不会关闭 -->
          <el-color-picker
            v-model="color"
            show-alpha
            :predefine="predefineColors"
            size="small"
            :teleported="false"
            @change="setColor"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            v-model="dark"
            size="small"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
            @change="changeDark"
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button
          type="primary"
          size="small"
          :icon="Setting"
          circle
        ></el-button>
      </template>
    </el-popover>
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
import { ref } from 'vue'
// 主题工具：读写本地存储 + 应用到 html 根节点
import {
  GET_COLOR,
  GET_DARK,
  SET_COLOR,
  SET_DARK,
  applyColor,
  applyDark,
} from '@/utils/theme'
//获取小仓库
import useLayoutSettingsStore from '@/store/moudules/settings'
let layoutsettingStore = useLayoutSettingsStore()
//引入用户小仓库（拿登录用户的信息）
import useUserStore from '@/store/moudules/user'
let userStore = useUserStore()
// 暗黑模式开关（初始值取本地存储，刷新后保持一致）
let dark = ref<boolean>(GET_DARK())

// 主题色（没设置过时显示 EP 默认主色）
let color = ref<string>(GET_COLOR() || '#409eff')

// 主题色预设（可选颜色）
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#05ceb7',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 暗黑模式切换：应用到 html + 持久化
const changeDark = () => {
  applyDark(dark.value)
  SET_DARK(dark.value)
}

// 主题色变化：应用主色与变体 + 持久化
const setColor = () => {
  applyColor(color.value)
  SET_COLOR(color.value)
}

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
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    outline: none;
  }
}
</style>
