<template>
  <!-- 注意单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 卡片一：一级 / 二级 / 三级分类联动选择
         （当前是占位骨架；下一步建立分类仓库 categoryStore + 分类接口后，
           再给每个 el-select 加上 v-model="categoryStore.c1Id" 和
           v-for 遍历 option 的联动逻辑） -->
    <!-- 全局组件 -->
    <Category></Category>
    <!-- 卡片二：平台已有的属性展示 -->
    <el-card style="margin: 10px 0px">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disable="categoryStore.c3Id ? false : true"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="属性名称" width="120px"></el-table-column>
        <el-table-column label="属性值名称"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/moudules/category'
let categoryStore = useCategoryStore()
</script>

<style scoped></style>
