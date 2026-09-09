// 用户管理模块的接口文件（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type {
  AllRoleResponseData,
  SetRoleData,
  User,
  UserResponseData,
} from './type'

const API = {
  // 获取全部已有用户：/admin/acl/user/{page}/{limit}?username=关键字
  ALLUSER_URL: '/admin/acl/user/',
  // 添加一个新的用户
  ADDUSER_URL: '/admin/acl/user/save',
  // 更新已有的用户账号
  UPDATEUSER_URL: '/admin/acl/user/update',
  // 获取全部角色 + 当前用户已有的角色
  ALLROLEURL: '/admin/acl/user/toAssign/',
  // 给已有用户分配角色
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL: '/admin/acl/user/remove/',
  // 批量删除用户
  DELETEALLUSER_URL: '/admin/acl/user/batchRemove',
} as const

// 获取已有用户数据（username 为搜索关键字，可为空字符串）
export const reqUserList = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}?username=${username}`,
  )

// 添加｜更新用户：携带 id 走更新，否则走添加
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取全部角色与当前用户已有的角色
export const reqAllRole = (userId: number | string) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

// 给用户分配角色
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

// 删除某一个用户
export const reqRemoveUser = (userId: number | string) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

// 批量删除用户：id 数组放在 DELETE 的请求体里（后端绑定的是裸数组）
export const reqRemoveBatchUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
