// 菜单管理模块的接口文件（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type { MenuParams, PermissionResponsData } from './type'

const API = {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL: '/admin/acl/permission',
  // 新增子菜单
  ADDMENU_URL: '/admin/acl/permission/save',
  // 更新已有菜单
  UPDATEMENU_URL: '/admin/acl/permission/update',
  // 删除菜单
  REMOVEMENU_URL: '/admin/acl/permission/remove/',
} as const

// 获取全部菜单数据
export const reqAllPermisson = () =>
  request.get<any, PermissionResponsData>(API.ALLPERMISSION_URL)

// 添加｜更新菜单：携带 id 走更新，否则走添加
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

// 删除菜单
export const reqRemoveMenu = (id: number | string) =>
  request.delete<any, any>(API.REMOVEMENU_URL + id)
