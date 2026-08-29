//封装本地存储数据与方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
//获取数据
export const GET_TOKEN = (): string => {
  // localStorage.getItem 可能返回 null，兜底为空字符串，保证返回类型是 string
  return localStorage.getItem('TOKEN') || ''
}