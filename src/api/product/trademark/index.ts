// 书写品牌管理的模块接口
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

const API = {
  // 获取已有品牌列表的地址（末尾带 /，方便拼接页码）
  TRADEMARK_URL: '/admin/product/baseTrademark/',
  ADDTRADEMARK_URL: '/admin/product/baseTrademark/save',
  UPDATETRADEMARK_URL: '/admin/product/baseTrademark/update',
  //删除已有品牌
  DELETE_URL: '/admin/product/baseTrademark/remove/',
}

// 获取品牌分页列表
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )
//添加与修改已有品牌的接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
//删除的方法
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
