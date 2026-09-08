// SPU 管理模块的接口文件（对接 vue3_admin_backend Go 后端）
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
} from './type'

const API = {
  // 获取 SPU 分页数据：/admin/product/1/3?category3Id=61
  HASSPU_URL: '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个 SPU 下全部的商品图片
  IMAGE_URL: '/admin/product/spuImageList/',
  // 获取某个 SPU 下已有的销售属性
  SPUHASSALEATTR_URL: '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性（颜色/版本/尺码）
  ALLSALE_URL: '/admin/product/baseSaleAttrList',
  // 追加一个新的 SPU
  ADDSPU_URL: '/admin/product/saveSpuInfo',
  // 更新已有的 SPU
  UPDATESPU_URL: '/admin/product/updateSpuInfo',
  // 追加一个新增的 SKU
  ADDSKU_URL: '/admin/product/saveSkuInfo',
  // 查看某一个 SPU 下全部 SKU
  SKUINFO_URL: '/admin/product/findBySpuId/',
  // 删除已有的 SPU
  REMOVESPU_URL: '/admin/product/deleteSpu/',
} as const

// 获取某一个三级分类下已有的 SPU 数据（分页）
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部 SPU 品牌的数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

// 获取某一个 SPU 下全部的图片地址
export const reqSpuImageList = (spuId: number | string) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取某一个 SPU 下已有的销售属性
export const reqSpuHasSaleAttr = (spuId: number | string) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取整个项目全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALE_URL)

// 新增｜修改 SPU：有 id 走更新，没有 id 走新增
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加 SKU
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取某个 SPU 下全部 SKU 数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuData[]>(API.SKUINFO_URL + spuId)

// 删除已有的 SPU
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
