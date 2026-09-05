<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- 演示用下拉：北京/上海/广州/深圳 是写死的示例选项
               下一步接分类仓库后，这里会改成 v-for 遍历 categoryStore 的选项 -->
        <el-select
          placeholder="请选择一级分类"
          style="width: 140px"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!-- label 要动态绑定用 :label，value 存选中项的 id -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择二级分类"
          style="width: 140px"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择三级分类"
          style="width: 140px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
//引入组件挂载完毕的方法
import { onMounted } from 'vue'
//引入分类相关的仓库
import useCategoryStore from '@/store/moudules/category'
let categoryStore = useCategoryStore()
onMounted(() => {
  //通知仓库发请求获取一级分类的数据
  categoryStore.getC1()
})
//一级下拉菜单的change事件
const handler = () => {
  //需要将二级和三级分类的数组清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.c2Arr = []
  //通知仓库去获取二级分类的数据
  categoryStore.getC2()
}
//二级菜单下拉的方法
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC3()
}
</script>

<style scoped></style>
