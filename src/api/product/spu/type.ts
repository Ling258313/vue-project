import type { Attr } from '../attr/type'

// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU 数据的 ts 类型
export interface SpuData {
  id?: number | string
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
}

// 数组：元素都是已有 SPU 数据类型
export type Records = SpuData[]

// 获取已有 SPU 分页接口返回的数据 ts 类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据的 TS 类型（后端 Trademark json: id/tmName/logoUrl）
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据 ts 类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的 ts 类型（后端 SpuImage json: id/imgName/imgUrl/spuId）
export interface SpuImg {
  id?: number
  spuId?: number
  imgName: string
  imgUrl: string
}

// 已有 SPU 的照片墙数据接口返回类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象 ts 类型
export interface SaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象
export interface SaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU 已有销售属性接口返回数据 ts 类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 项目全部销售属性数据 ts 类型
export interface HasSaleAttr {
  id: number
  name: string
}

// 获取全部销售属性接口返回的数据 ts 类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

// SKU 平台属性（提交给后端用）
export interface SkuAttrValue {
  attrId: string | number // 平台属性ID
  valueId: string | number // 属性值ID
}

// SKU 销售属性（提交给后端用）
export interface SkuSaleAttrValue {
  saleAttrId: string | number // 销售属性ID
  saleAttrValueId: string | number // 销售属性值ID
}

// SKU 图片（提交给后端用，字段与后端 SkuImgDTO 对齐：imgName/imgUrl/spuImgId/isDefault）
export interface SkuImgSubmit {
  imgName: string // 图片名称
  imgUrl: string // 图片地址
  spuImgId?: number | string // 对应的 SPU 照片墙图片 id
  isDefault: string // '1' 默认图 / '0' 非默认图
}

// SKU 数据
export interface SkuData {
  category3Id: string | number // 三级分类的ID
  spuId: string | number // 已有的SPU的ID
  tmId: string | number // SPU 品牌ID
  skuName: string // SKU 名字
  price: string | number // SKU 价格
  weight: string | number // SKU 重量
  skuDesc: string // SKU 描述
  skuAttrValueList: SkuAttrValue[] // 平台属性
  skuSaleAttrValueList: SkuSaleAttrValue[] // 销售属性
  skuDefaultImg: string // 售卖SKU图片地址
  skuImageList?: SkuImgSubmit[] // SKU 图片列表（保存时随照片墙图片一起提交）
}

// 获取 SKU 数据接口返回 ts 类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}

// 平台属性扩展一个字段：用于 SKU 表单里收集"属性id:属性值id"
export interface SkuAttr extends Attr {
  attrIdAndValueId?: string
}

// SPU 销售属性扩展一个字段：用于 SKU 表单里收集"销售属性id:销售属性值id"
export interface SkuSaleAttr extends SaleAttr {
  saleIdAndValueId?: string
}
