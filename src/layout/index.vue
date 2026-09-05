<template>
  <div class="layout_container">
    <!-- 左侧的菜单（折叠时切换宽度类） -->
    <div
      class="layout_slider"
      :class="{ layout_slider_collapse: layoutStore.isCollapse }"
    >
      <Logo></Logo>
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件：:collapse 绑定响应式变量，:collapse-transition="false" 避免折叠动画卡顿 -->
        <el-menu
          background-color="#001529"
          text-color="white"
          :collapse="layoutStore.isCollapse"
          :collapse-transition="false"
          active-text-color="#05ceb7"
          :default-active="$route.path"
        >
          <Menu :menuList="useStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部的导航（含折叠切换按钮） -->
    <div
      class="layout_tabbar"
      :class="{ layout_tabbar_collapse: layoutStore.isCollapse }"
    >
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div
      class="layout_main"
      :class="{ layout_main_collapse: layoutStore.isCollapse }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取当前路由对象（useRoute 返回当前路由信息，useRouter 返回路由器实例）
import { useRoute } from 'vue-router'
//引入左侧菜单logo的子组件
import Logo from '@/layout/logo/index.vue'
//引入动态生成的菜单
import Menu from '@/layout/menu/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/moudules/user'
//引入布局状态小仓库（折叠状态）
import useLayoutStore from '@/store/moudules/layout'
//引入顶部组件
import Tabbar from '@/layout/tabbar/index.vue'
//右侧内容的展示
import Main from '@/layout/main/index.vue'

let $route = useRoute()
let useStore = useUserStore()
// 布局状态（折叠等）统一从 store 读取
let layoutStore = useLayoutStore()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
}
.layout_slider {
  color: rgb(251, 251, 251);
  width: $base-menu-width;
  height: 100vh;
  background: $base-menu-background;
  // 宽度变化加过渡动画，折叠/展开更平滑
  transition: width 0.3s;
  // 折叠状态：侧边栏整体收窄到 64px
  &.layout_slider_collapse {
    width: $base-menu-collapse-width;
    // 折叠时隐藏 logo 文字
    :deep(.logo p) {
      display: none;
    }
    :deep(.logo img) {
      margin-left: -10px;
    }
  }
  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-menu-logo-height);
    .el-menu {
      border-right: none;
    }
  }
}
.layout_tabbar {
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  background: #05ceb7;
  position: fixed;
  top: 0;
  left: $base-menu-width;
  transition: all 0.3s;
  &.layout_tabbar_collapse {
    width: calc(100% - $base-menu-collapse-width);
    left: $base-menu-collapse-width;
  }
}
.layout_main {
  position: absolute;
  padding: 20px;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  background: #f5f7fa;
  left: $base-menu-width;
  top: $base-tabbar-height;
  overflow: auto;
  transition: all 0.3s;
  &.layout_main_collapse {
    width: calc(100% - $base-menu-collapse-width);
    left: $base-menu-collapse-width;
  }
}
</style>
