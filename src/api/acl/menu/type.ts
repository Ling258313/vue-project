// 菜单管理模块的 ts 类型（json 字段与后端 model.Menu 核对一致）
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 菜单与按钮数据 ts 类型
export interface Permission {
  id: number
  pid?: number
  name: string
  code?: string
  toCode?: string
  type?: number
  status?: string
  level: number
  children?: PermissionList
  select?: boolean
  createTime?: string
  updateTime?: string
}

// 菜单与按钮数组
export type PermissionList = Permission[]

// 获取菜单数据接口返回的数据 ts 类型
export interface PermissionResponsData extends ResponseData {
  data: PermissionList
}

// 添加与修改菜单携带参数的 ts 类型（后端 ParamMenuSave / ParamMenuUpdate）
export interface MenuParams {
  id?: number
  level: number
  code: string // 权限值
  name: string // 菜单名称
  pid: number // 父菜单 id
}
