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
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
// 引入布局状态小仓库，折叠状态直接读写 store，不再通过 props/emits 传递
import useLayoutStore from '@/store/moudules/layout'

let layoutStore = useLayoutStore()
// 当前路由对象，用于动态生成面包屑
let $route = useRoute()

// 面包屑数据：只保留有 title 的层级，并去掉"和下一级同名"的重复项
// 例如首页的匹配链是 [/(首页), /home(首页)]，只显示一个"首页"
const breadcrumbList = computed(() => {
  const list = $route.matched.filter(
    (item: any) => item.meta && item.meta.title,
  )
  return list.filter(
    (item: any, index: number) =>
      index === list.length - 1 ||
      item.meta.title !== list[index + 1].meta.title,
  )
})
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
