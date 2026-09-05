// 进行 axios 的二次封装（对接真实后端：所有 HTTP 状态码都是 200，业务结果看 code 字段）
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入获取 token 的工具
import { GET_TOKEN } from '@/utils/token'
// 利用 create 方法创建 axios 实例
const request = axios.create({
  // 基础路径：本地 Go 后端地址（.env.development 里 VITE_APP_BASE_API）
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

// 请求拦截器：给请求头携带 token
request.interceptors.request.use((config) => {
  const token = GET_TOKEN()
  // 后端从 Header 的 Token 里读（Go 读取不区分大小写）
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调：判断业务 code（后端接口无论成败 HTTP 状态都是 200）
    // 200 成功 / 201 参数错误 / 202 用户名已存在 / 203 用户名不存在
    // 204 用户名或密码错误 / 205 服务繁忙 / 206 无效 Token / 207 需要登录
    const res = response.data
    if (res && typeof res.code === 'number' && res.code !== 200) {
      // 提示后端返回的错误信息
      ElMessage({
        type: 'error',
        message: res.message || '服务异常',
      })
      return Promise.reject(new Error(res.message || '服务异常'))
    }
    // 成功：把 axios 包装层去掉，直接返回后端数据 { code, message, data, ok }
    return response.data
  },
  (error) => {
    // 失败回调：处理 http 网络错误（连接失败、超时等；后端业务错误不会走到这里）
    let message: string
    const status = error.response?.status
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
        message = error.code === 'ECONNABORTED' ? '请求超时' : '网络出现问题'
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

export default request
