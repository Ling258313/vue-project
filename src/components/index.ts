// 引入项目中全部的全局组件
import type { App, Component } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'

// 全局组件对象
const allGlobalComponent: Record<string, Component> = {
  SvgIcon,
  Pagination,
  Category,
}

// 对外暴露插件对象
export default {
  // 务必叫做 install 方法
  install(app: App) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    // 注意：Element Plus 图标已在 main.ts 里统一注册过一次，
    // 这里不要再注册，否则会报 "Component xxx has already been registered"
  },
}
