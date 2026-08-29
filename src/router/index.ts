//通过vue-router的插件来实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './router'

let router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
