// SKU 管理模块的接口文件（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type { SkuInfoData, SkuResponseData } from './type'

const API = {
  // 获取已有 SKU 分页数据：/admin/product/list/{page}/{limit}
  SKU_URL: '/admin/product/list/',
  // 商品上架
  SALE_URL: '/admin/product/onSale/',
  // 商品下架
  CANCELSALE_URL: '/admin/product/cancelSale/',
  // 获取商品详情
  SKUINFO_URL: '/admin/product/getSkuInfo/',
  // 删除已有的商品
  DELETESKU_URL: '/admin/product/deleteSku/',
} as const

// 获取已有 SKU 的分页数据
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 商品上架
export const reqSaleSku = (skuId: number | string) =>
  request.get<any, any>(API.SALE_URL + skuId)

// 商品下架
export const reqCancelSale = (skuId: number | string) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

// 获取商品详情
export const reqSkuInfo = (skuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

// 删除已有的商品
export const reqRemoveSku = (skuId: number | string) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
