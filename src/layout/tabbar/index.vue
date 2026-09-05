<template>
  <div class="tabbar">
    <!-- 左侧：折叠按钮 + 面包屑（状态直接从 store 读，无需传 prop） -->
    <Breadcrumb></Breadcrumb>
    <!-- 右侧：刷新/全屏/设置 + 头像下拉 -->
    <Setting></Setting>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/setting/index.vue'
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  background-color: #fff;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}
</style>
