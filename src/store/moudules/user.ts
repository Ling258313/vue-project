//创建用户相关的小仓库（对接 vue3_admin_backend Go 后端）
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserinfo, reqLogout } from '@/api/user'
//引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具文件
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
//引入路由（常量路由 + 异步路由）与过滤工具
import { constantRoute, asyncRoute } from '@/router/routes'
import { filterAsyncRoute } from '@/utils/permission'
//退出登录时要清空已注册的动态路由
import { resetRouter } from '@/router'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储菜单路由（还没登录时只有常量路由）
      asyncRoutes: [], //当前用户有权限的异步路由（登录后按菜单权限算出）
      userInfo: null, //用户信息，初始为 null（未登录/未获取）
    }
  },
  actions: {
    // 用户登录的方法：成功后后端直接返回 token 字符串
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      // 后端成功 code 为 200
      if (result.code == 200) {
        // data 就是 token 字符串（不是 { token } 对象）
        this.token = result.data as string
        //本地持久化存储
        SET_TOKEN(result.data as string)
        //保证返回的是一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息的方法
    //注意：方法名不能和 state 里的 userInfo 重名（Pinia 的 state 和 actions 共用命名空间）
    async getUserInfo() {
      const result: userResponseData = await reqUserinfo()
      if (result.code == 200) {
        // 后端直接返回 { name, avatar, roles, buttons, routes }
        this.userInfo = result.data
        // 按后端返回的菜单 code（routes）递归过滤异步路由：
        // 没权限的路由压根不会注册到 router 上，手打 URL 也进不去
        this.asyncRoutes = filterAsyncRoute(
          asyncRoute,
          result.data.routes || [],
        )
        // 侧边栏的数据源：常量路由 + 当前用户有权限的异步路由
        this.menuRoutes = [...constantRoute, ...this.asyncRoutes]
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      // 通知服务器（真实后端有登出接口；即使请求失败也继续本地清理）
      try {
        await reqLogout()
      } catch {
        // 忽略登出接口错误，本地状态必须清空
      }
      //清空仓库中存储的 token
      this.token = ''
      //清空仓库中存储的用户信息
      this.userInfo = null
      // 清空已动态注册的路由，避免切换到下一个账号时残留上一个账号的权限
      resetRouter()
      // 菜单回到只剩常量路由
      this.asyncRoutes = []
      this.menuRoutes = constantRoute
      //清除本地存储中的 token
      REMOVE_TOKEN()
    },
  },
  getters: {},
})
//对外暴露获取小仓库的方法
export default useUserStore
