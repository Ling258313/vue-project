import type { RouteRecordRaw } from 'vue-router'
import type { userInfo } from '@/api/user/type'
import type { CategoryObj } from '@/api/product/attr/type'

export interface UserState {
  token: string
  menuRoutes: RouteRecordRaw[] //菜单路由
  userInfo: userInfo | null //登录用户的信息
}

//定义分类仓库state对象的ts类型
export interface CategoryState {
  // 选中的一级分类 id
  c1Id: string | number
  // 一级分类数据列表：注意要声明成"可以装多个元素的数组"，
  // 不能写成 []（空数组字面量会被推断成"只能有 0 个元素的元组"）
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
  c2Id: string | number
  c3Id: string | number
}
