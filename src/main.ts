import { createApp } from 'vue'
// 引入 element-plus 插件与样式
import ElementPlus from 'element-plus'
// 引入全部 element-plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// 暗黑模式样式变量（配合 html 根节点的 dark 类名生效）
import 'element-plus/theme-chalk/dark/css-vars.css'
// 配置 element-plus 国际化（中文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 注册 SVG 图标
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册全局组件
import globalComponents from '@/components'
// 注册按钮权限指令 v-has
import { isHasButton } from '@/directive/has'
import App from '@/App.vue'
//引用路由
import router from './router'
//引用仓库
import pinia from './store'
// 获取应用实例对象
const app = createApp(App)

// 全局注册 element-plus 全部图标组件（路由 meta.icon 存的是图标名字符串，靠这里解析）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 安装 element-plus 插件，配置中文语言包
app.use(ElementPlus, {
  locale: zhCn, // element-plus 国际化配置
})
//引入模板的全局样式
import '@/styles/index.scss'
// 注册全局自定义组件
app.use(globalComponents)
//安装仓库
app.use(pinia)
// 注册全局按钮权限指令 v-has（必须在 mount 之前）
isHasButton(app)
// 注册模板路由
app.use(router)
//引入路由鉴权文件
import './permission'
// 应用本地保存的主题（暗黑模式 / 主题色），刷新后保持上次的选择
import { initTheme } from '@/utils/theme'
initTheme()
// 将应用挂载到挂载点上
app.mount('#app')
