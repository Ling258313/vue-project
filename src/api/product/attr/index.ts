// 属性管理模块的接口文件
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

const API = {
  // 一级分类接口地址
  C1_URL: '/admin/product/getCategory1',
  // 二级分类接口地址（末尾带 /，方便拼接一级分类 id）
  C2_URL: '/admin/product/getCategory2/',
  // 三级分类接口地址（末尾带 /，方便拼接二级分类 id）
  C3_URL: '/admin/product/getCategory3/',
  ATTR_URL: '/admin/product/attrInfoList/',
  //添加或者修改已有的属性的接口
  ADDORUPDATEATTR_URL: '/admin/product/saveAttrInfo',
  //删除某一个已有的属性
  DELETEATTR_URL: '/admin/product/deleteAttr/',
} as const

// 获取一级分类的方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

// 根据一级分类 id 获取二级分类
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

// 根据二级分类 id 获取三级分类
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
//获取对应分类下的属性和属性接口
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
//新增或者修改已有属性的接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
//删除某一个已有的属性或者id方法
export const reqRemoveAttr = (attrid: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrid)
