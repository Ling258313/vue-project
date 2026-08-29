<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    background
    layout="total, sizes, prev, pager, next, jumper"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 数据总条数（由父组件传入）
defineProps<{ total: number }>()

// 当前页码
const currentPage = ref(1)
// 每页条数
const pageSize = ref(10)
// 可选的每页条数
const pageSizes = [10, 20, 30, 50]
</script>
