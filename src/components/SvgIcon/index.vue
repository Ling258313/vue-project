<template>
  <svg aria-hidden="true" :style="svgStyle">
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 接受父组件传递过来的参数
const props = withDefaults(
  defineProps<{
    // xlink:href 属性值前缀
    prefix?: string
    // 提供使用的图标名字（对应 src/assets/icons 下的文件名）
    name: string
    // 接受父组件传递颜色
    color?: string
    // 图标尺寸（px）
    size?: number
  }>(),
  {
    prefix: '#icon-',
    color: 'currentColor',
    size: 30,
  },
)

// 图标尺寸样式
const svgStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
}))
</script>
