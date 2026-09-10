// 菜单权限过滤工具：把后端返回的菜单 code 列表，套用到前端异步路由上
import type { RouteRecordRaw } from 'vue-router'

/**
 * 递归过滤异步路由
 * @param routes    待过滤的路由表（asyncRoute）
 * @param menuCodes 后端 /admin/acl/index/info 返回的 routes（当前用户拥有的菜单 code）
 * @returns 过滤后的路由表
 *
 * 规则：
 * 1. 有子路由的节点：先递归过滤子路由，子路由被过滤空了，父节点整块丢弃
 *    （这样"只勾了子菜单、没勾父菜单"也不会漏，父级会自动兜底）
 * 2. 没有子路由的叶子节点：name 在后端菜单里才保留
 * 3. 后端返回但前端没有对应路由的 code（如 Category、Order、测试菜单）直接忽略
 */
export const filterAsyncRoute = (
  routes: any[],
  menuCodes: string[],
): RouteRecordRaw[] => {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    // 生成新对象，避免直接改动 asyncRoute 原数组
    const item: any = { ...route }
    if (item.children && item.children.length > 0) {
      const children = filterAsyncRoute(item.children, menuCodes)
      if (children.length > 0) {
        item.children = children
        result.push(item)
      }
      return
    }
    if (item.name && menuCodes.includes(item.name)) {
      result.push(item)
    }
  })
  return result
}
