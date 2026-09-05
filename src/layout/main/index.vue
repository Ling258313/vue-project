<template>
  <router-view v-slot="{ Component }">
    <!-- 默认模式（无 out-in）：新旧页面同时淡入淡出，
                 避免 out-in 模式下旧页退场卡住导致 main 空白 -->
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <!-- key = 路由路径 + 刷新序号：
                     路由切换时 key 变化 → 过渡动画正确销毁旧组件、创建新组件（避免 main 空白）
                     刷新序号变化（点刷新按钮）→ 强制重建当前页组件 -->
      <component
        :is="Component"
        :key="route.path + '-' + refreshKey"
      ></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useLayoutSettingsStore from '@/store/moudules/settings'
let layoutsettingStore = useLayoutSettingsStore()
// 当前路由：切换路由时 key 跟着变，避免过渡动画"认错人"导致 main 空白
let route = useRoute()

// 刷新用的 key：值变化时触发组件强制重建
let refreshKey = ref(0)

//监听仓库内部数据是否发生变化
watch(
  () => layoutsettingStore.refsh,
  () => {
    // key 自增 → 组件被销毁重建（相当于刷新页面内容）
    refreshKey.value++
  },
)
</script>

<style scoped>
/* ========== 过渡动画的六个关键类 ========== */
/* 名称来自 <transition name="fade">，类名规则：name-enter/leave-active/from/to */

/* 效果一：淡入淡出（fade）—— 柔和、简洁，后台最常用 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
/* 进入前 / 离开后：透明度为 0 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 效果二（想用就把 name 改成 slide，并启用下面这段） ========== */
/* 淡入 + 轻微上移：更有层次感，适合内容区切换 */
/*.slide-enter-active {
  transition: all 0.4s ease-out;
}
.slide-leave-active {
  transition: all 0.3s ease-in;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}*/

/* ========== 效果三：缩放淡入（想用就把 name 改成 scale） ========== */
/*.scale-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.scale-leave-active {
  transition: all 0.25s ease-in;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}*/
</style>
