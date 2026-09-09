// 角色管理模块的 ts 类型（json 字段与后端 model.Role / ResponseRoleList 核对一致）
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 角色数据 ts 类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: string
}

// 数组：元素都是角色数据
export type Records = RoleData[]

// 菜单与按钮数据的 ts 类型（后端 model.Menu）
export interface MenuData {
  id: number
  pid?: number
  name: string
  code?: string
  toCode?: string
  type?: number
  status?: string
  level: number
  children?: MenuList
  // 该角色是否已有这个权限（后端 toAssign 接口标记）
  select?: boolean
  createTime?: string
  updateTime?: string
}

// 菜单与按钮数组
export type MenuList = MenuData[]

// 获取菜单与按钮权限接口返回的数据 ts 类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}

// 获取角色分页接口返回的数据 ts 类型（后端 ResponseRoleList）
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}
