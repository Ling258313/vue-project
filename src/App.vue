<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
</script>

<template>
  <div>我是app</div>
  <el-button type="primary" size="default" :icon="Plus">主要按钮</el-button>
  <SvgIcon name="home" color="#409EFF" :size="40" />
</template>
