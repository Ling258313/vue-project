import { createApp } from 'vue'
// 引入 element-plus 插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置 element-plus 国际化（中文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 注册 SVG 图标
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册全局组件
import globalComponents from '@/components'
import App from '@/App.vue'
//引用路由
import router from './router'
//引用仓库
import pinia from './store'
// 获取应用实例对象
const app = createApp(App)

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
// 注册模板路由
app.use(router)
// 将应用挂载到挂载点上
app.mount('#app')
