// 用户接口相关参数的 TS 类型（对接 vue3_admin_backend Go 后端）
// 后端统一返回格式：{ code, message, data, ok }，HTTP 状态码恒为 200
// code: 200 成功 / 201 参数错误 / 202 用户名已存在 / 203 用户名不存在
//       204 用户名或密码错误 / 205 服务繁忙 / 206 无效 Token / 207 需要登录 / 208 有子节点不可删

// 登录表单
export interface loginFormData {
  username: string
  password: string
}

// 全部接口返回数据的公共结构
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 登录接口返回：data 就是 token 字符串（注意：不是 { token } 对象）
export interface loginResponseData extends ResponseData {
  data: string
}

// 用户信息（后端 /admin/acl/index/info 返回的 data 结构）
export interface userInfo {
  name: string // 用户名（登录账号）
  avatar: string
  roles: string[]
  buttons: string[]
  routes: string[]
}

// 获取用户信息接口返回
export interface userResponseData extends ResponseData {
  data: userInfo
}
