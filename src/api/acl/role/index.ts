// 角色管理模块的接口文件（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type { MenuResponseData, RoleData, RoleResponseData } from './type'

const API = {
  // 获取全部角色：/admin/acl/role/{page}/{limit}?roleName=关键字
  ALLROLE_URL: '/admin/acl/role/',
  // 新增角色
  ADDROLE_URL: '/admin/acl/role/save',
  // 更新已有角色
  UPDATEROLE_URL: '/admin/acl/role/update',
  // 删除已有角色
  REMOVEROLE_URL: '/admin/acl/role/remove/',
  // 获取全部菜单与按钮数据（含该角色已有权限）
  ALLPERMISSION_URL: '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  SETPERMISSION_URL: '/admin/acl/permission/doAssign?',
} as const

// 获取已有角色数据（roleName 为搜索关键字，可为空字符串）
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )

// 添加｜更新角色：携带 id 走更新，否则走添加
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 删除已有角色
export const reqRemoveRole = (roleId: number | string) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)

// 获取全部菜单与按钮数据（含该角色已有权限的 select 标记）
export const reqAllMenuList = (roleId: number | string) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

// 给角色分配权限：permissionId 以逗号拼接（后端按逗号切分）
export const reqSetPermission = (
  roleId: number | string,
  permissionId: number[],
) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
