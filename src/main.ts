import { createApp } from 'vue'
// 引入 element-plus 插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置 element-plus 国际化（中文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 注册 SVG 图标
import 'virtual:svg-icons-register'
import './style.css'
import App from '@/App.vue'

// 获取应用实例对象
const app = createApp(App)

// 安装 element-plus 插件，配置中文语言包
app.use(ElementPlus, {
  locale: zhCn, // element-plus 国际化配置
})
// 将应用挂载到挂载点上
app.mount('#app')
