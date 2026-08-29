//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
//引入数据类型
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具文件
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'
let useUserStore = defineStore('User', {
  state: ():UserState => {
    return {
      token:GET_TOKEN(),
    }
  },
  actions: {
    // 用户登录的方法
    async userLogin(data: loginForm) {
      let result: loginResponseData = await reqLogin(data)
      //成功或者失败200-》201
      if (result.code == 200) {
        this.token = result.data.token as string
        //本地持久化存储
        SET_TOKEN(result.data.token as string)
        //保证返回的是一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
  },
  getters: {},
})
//对外暴露获取小仓库的方法
export default useUserStore
