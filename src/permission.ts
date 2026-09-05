// 路由鉴权
import router from '@/router'
import useUserStore from '@/store/moudules/user'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
nprogress.configure({ showSpinner: false, trickleSpeed: 200 })

// 白名单：无需登录即可访问的路由
const whiteList = ['/login', '/404']

// 全局前置守卫：每次路由跳转前执行
// 注意：useUserStore() 必须在回调里调用（模块加载时 pinia 还没激活，会报错）
router.beforeEach(async (to: any) => {
  nprogress.start()
  // 在回调内获取仓库（此时 pinia 已激活）
  const userStore = useUserStore()

  // ① 白名单路由直接放行（登录页、404）
  if (whiteList.includes(to.path)) {
    return true
  }

  // ② 有 token：已登录
  if (userStore.token) {
    // 已登录还访问登录页 → 重定向到首页
    if (to.path === '/login') {
      return { path: '/' }
    }
    // 有 token 但没有用户信息（页面刷新/状态丢失后）→ 补拉一次，让头像/名字自愈
    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfo()
      } catch {
        // token 失效：清空并踢回登录页
        userStore.userLogout()
        ElMessage.error('登录状态已失效，请重新登录')
        return { path: '/login', query: { redirect: to.fullPath } }
      }
    }
    return true
  }

  // ③ 没有 token：拦截，跳登录页并记录"想去的页面"，登录成功后跳回
  return { path: '/login', query: { redirect: to.fullPath } }
})

// 全局后置守卫：跳转完成后执行
router.afterEach((to: any) => {
  // 跳转完成后结束进度条（start 之后必须 done，否则进度条永远爬不到 100% 也不消失）
  nprogress.done()
  // 根据路由 meta.title 设置浏览器标签页标题
  document.title = to.meta.title ? to.meta.title + ' - 硅谷甄选' : '硅谷甄选'
})
