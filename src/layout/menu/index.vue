<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个 -->
    <el-menu-item
      v-else-if="item.children.length == 1"
      :index="item.children[0].path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有多个子路由 -->
    <el-sub-menu v-else :index="item.path">
      <!-- 注意：el-sub-menu 的图标必须放在 #title 插槽里，否则折叠后不显示 -->
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取父组件（layout）传递过来的全部路由数据
// 注意：属性名要写成字符串数组 ['menuList']，不是变量 menuList
defineProps(['menuList'])
//获取路由器的对象
let $router = useRouter()
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped></style>
