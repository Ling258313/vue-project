// 统一管理用户相关的接口
import request from '@/utils/request'
import type {loginForm,loginResponseData,userResponseData} from './type'

// 接口路径常量（项目启用 erasableSyntaxOnly，不能用 enum）
const API = {
  LOGIN_URL: '/user/login',
  USERINFO_URL: '/user/info',
} as const

// 暴露请求函数
// 登录接口方法
export const reqLogin = (data: loginForm) => request.post<any,loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息的方法
export const reqUserinfo = () => request.get<any,userResponseData>(API.USERINFO_URL)
