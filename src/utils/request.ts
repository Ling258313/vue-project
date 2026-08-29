//进行axios的二次封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
//利用create方法创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
//request实例添加请求和响应拦截器
request.interceptors.request.use((config) => {
  return config
})
request.interceptors.response.use(
  (response) => {
    //成功回调
    return response.data
  },
  (error) => {
    //处理http网络错误
    //定义一个变量
    let message: string
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '你无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    ElMessage({
      type: 'error',
      message,
    })

    return Promise.reject('error')
  },
)

export default request
