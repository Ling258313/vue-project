<template>
  <div class="tabbar_left">
    <!-- 折叠按钮：状态直接从 store 读取和修改 -->
    <el-icon
      class="collapse_btn"
      @click="layoutStore.updateCollapse()"
      style="margin-right: 20px"
    >
      <Fold v-if="!layoutStore.isCollapse" />
      <Expand v-else />
    </el-icon>
    <!-- 面包屑：根据当前路由层级动态生成 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        v-show="item.meta && item.meta.title"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { Fold, Expand } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
// 引入布局状态小仓库，折叠状态直接读写 store，不再通过 props/emits 传递
import useLayoutStore from '@/store/moudules/layout'

let layoutStore = useLayoutStore()
// 当前路由对象，用于动态生成面包屑
let $route = useRoute()
</script>

<style scoped>
.tabbar_left {
  display: flex;
  align-items: center;
  margin-left: 20px;
  .collapse_btn {
    margin-left: 10px;
    font-size: 24px;
    cursor: pointer;
    color: #070707;
  }
}
</style>
