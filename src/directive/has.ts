// 按钮级权限：全局指令 v-has + 可复用的判断函数
//
// 原理：后端 GET /admin/acl/index/info 会把当前用户的按钮权限码放在 data.buttons 里
//      （menu 表 level=4 的 code，例如 btn.User.add），
//      这里做的就是"这个码在不在 buttons 数组里"，不在就把节点从 DOM 上摘掉。
//
// 边界：它只是"看得见/看不见"的体验层控制，不是安全边界。
//      被摘掉的只是一个 DOM 节点，接口本身照样能被直接调用，
//      真正的防线是"路由权限（后端菜单过滤）+ 后端接口鉴权"。
import pinia from '@/store'
import useUserStore from '@/store/moudules/user'

/**
 * 判断当前用户是否拥有某个按钮权限码
 * @param code 后端 menu 表 level=4 的 code，例如 'btn.User.add'
 */
export const hasPermission = (code: string): boolean => {
  // 显式传入 pinia：指令的 mounted 不属于组件 setup 上下文，不依赖 activePinia 更稳
  const userStore = useUserStore(pinia)
  // userInfo 还没拉回来时按"没有权限"处理（路由守卫保证进入页面前用户信息已就绪）
  const buttons = userStore.userInfo?.buttons || []
  return buttons.includes(code)
}

/** 注册全局指令 v-has */
export const isHasButton = (app: any) => {
  app.directive('has', {
    // 使用该指令的元素挂载完成后执行一次
    mounted(el: any, options: any) {
      // options.value 就是 v-has="'btn.User.add'" 里的那个权限码
      if (!hasPermission(options.value)) {
        // 没有权限：把元素从 DOM 上摘掉（比 display:none 更彻底，也不会被改样式"复活"）
        el.parentNode?.removeChild(el)
      }
    },
  })
}
