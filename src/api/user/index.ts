// 统一管理用户相关的接口（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type { loginFormData, loginResponseData, userResponseData } from './type'

// 接口路径常量（项目启用 erasableSyntaxOnly，不能用 enum）
const API = {
  LOGIN_URL: '/admin/acl/index/login',
  USERINFO_URL: '/admin/acl/index/info',
  LOGOUT_URL: '/admin/acl/index/logout',
} as const

// 登录接口：data 为 token 字符串
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserinfo = () =>
  request.get<any, userResponseData>(API.USERINFO_URL)

// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
