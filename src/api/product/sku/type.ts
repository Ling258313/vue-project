// SKU 管理模块的 ts 类型（json 字段与 vue3_admin_backend 的 ResponseSkuInfo 核对一致）
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SKU 平台属性
export interface SkuAttrValue {
  id?: number | string
  attrId?: number | string
  valueId?: number | string
  attrName?: string
  valueName: string
  skuId?: number | string
}

// SKU 销售属性
export interface SkuSaleAttrValue {
  id?: number | string
  saleAttrId?: number | string
  saleAttrValueId?: number | string
  saleAttrName?: string
  saleAttrValueName: string
  skuId?: number | string
}

// SKU 图片
export interface SkuImg {
  id?: number | string
  skuId?: number | string
  imgName?: string
  imgUrl: string
  spuImgId?: number | string
  isDefault?: string
}

// SKU 数据
export interface SkuData {
  id?: number | string
  category3Id?: number | string
  tmId?: number | string
  skuName: string
  skuDesc: string
  skuDefaultImg: string
  price: number | string
  weight: number | string
  isSale?: number
  skuAttrValueList?: SkuAttrValue[]
  skuSaleAttrValueList?: SkuSaleAttrValue[]
  skuImageList?: SkuImg[]
}

// 获取已有 SKU 分页接口返回的数据 ts 类型（后端 ResponseSkuInfoList）
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// SKU 详情接口返回的数据 ts 类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
