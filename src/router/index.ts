//通过vue-router的插件来实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoute, anyRoute } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  // 只挂常量路由；异步路由要等拿到用户菜单权限后再动态注册
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

// 记录已经动态注册进来的路由 name，退出登录时按名字逐个移除
let dynamicRouteNames: string[] = []

/**
 * 动态注册当前用户有权限访问的路由
 * @param routes 过滤后的异步路由（store 里的 asyncRoutes）
 */
export const registerDynamicRoutes = (routes: RouteRecordRaw[]) => {
  routes.forEach((route) => {
    const name = route.name as string | undefined
    // 已经注册过就不再重复注册，避免 vue-router 的同名覆盖警告
    if (name && router.hasRoute(name)) return
    router.addRoute(route)
    if (name) dynamicRouteNames.push(name)
  })
  // 任意路由（404 兜底）必须最后一个注册，否则会把动态路由抢先匹配走
  if (!router.hasRoute('Any')) router.addRoute(anyRoute)
}

/** 清空动态路由：退出登录 / 切换账号时调用，避免残留上一个账号的权限 */
export const resetRouter = () => {
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) router.removeRoute(name)
  })
  dynamicRouteNames = []
  if (router.hasRoute('Any')) router.removeRoute('Any')
}

export default router
