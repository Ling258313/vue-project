// 用户管理模块的 ts 类型（json 字段与后端 model.ResponseUser 核对一致）
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 用户信息 ts 类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  roleName?: string
  phone?: string
}

// 数组：元素都是用户信息
export type Records = User[]

// 获取用户分页接口返回的数据 ts 类型（后端 ResponseUserList）
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 角色 ts 类型（后端 model.Role）
export interface Role {
  id?: number
  roleName: string
  remark?: string
  createTime?: string
  updateTime?: string
}

// 全部角色
export type AllRole = Role[]

// 获取全部角色与当前用户已有角色接口返回的数据 ts 类型（后端 ResponseToAssignRole）
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 给用户分配角色接口携带参数的 ts 类型（后端 ParamDoAssignRole）
export interface SetRoleData {
  userId: number
  roleIdList: number[]
}
