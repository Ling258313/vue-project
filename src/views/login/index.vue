<template>
  <div>
    <div class="login_container">
      <el-row>
        <el-col :span="12" :xs="0"></el-col>
        <el-col :span="12" :xs="24">
          <el-form
            ref="loginFormRef"
            class="login_form"
            :model="loginForm"
            :rules="rules"
          >
            <h1>Hello</h1>
            <h2>欢迎来到硅谷甄选</h2>
            <el-form-item prop="username">
              <el-input
                :prefix-icon="User"
                v-model="loginForm.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                :prefix-icon="Lock"
                v-model="loginForm.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                class="login_btn"
                type="primary"
                size="default"
                @click="login"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
//收集账号和密码的数据
import { reactive, ref } from 'vue'
//引入路由
import { useRouter, useRoute } from 'vue-router'
//引入消息提示
import { ElNotification, type FormInstance } from 'element-plus'
//引入小仓库
import useUserStore from '@/store/moudules/user'
//引入获取当前时间的函数
import { getTime } from '@/utils/times'

let useStore = useUserStore()
let router = useRouter()
let route = useRoute()
let loginForm = reactive({ username: 'admin', password: '111111' })
let loading = ref(false)
//表单实例引用，用于主动触发校验
let loginFormRef = ref<FormInstance>()
//登录按钮回调
const login = async () => {
  // 第一步：表单校验，不通过则直接返回，不发请求
  try {
    await loginFormRef.value?.validate()
  } catch {
    return
  }
  // 开始加载
  loading.value = true
  try {
    // 等待登录接口返回，成功时 userLogin 内部已把 token 存进 localStorage
    await useStore.userLogin(loginForm)
    ElNotification({
      type: 'success',
      message: `欢迎回来${loginForm.username}`,
      title: `HI,${getTime()}好`,
    })
    //加载效果消失
    loading.value = false
    // 跳转：优先回到退出前的页面（redirect 参数），没有则回首页
    const redirect = (route.query.redirect as string) || '/'
    router.push({ path: redirect || '/' })
  } catch (error) {
    loading.value = false
    // 失败（账号密码错误 / 网络错误）走到这里
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验函数：账号
//rule: Element Plus 传入的规则对象（一般用不到）
//value: 表单元素的文本内容
//callback: 校验通过时无参调用；不通过时传入 new Error('提示信息')
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // 账号规则：字母开头，5~10 位字母、数字或下划线
  if (/^[a-zA-Z][a-zA-Z0-9_]{4,9}$/.test(value)) {
    callback()
  } else {
    callback(new Error('账号需以字母开头，5~10位字母、数字或下划线'))
  }
}

//自定义校验函数：密码
const validatorPassword = (_rule: any, value: any, callback: any) => {
  // 密码规则：6~10 位，只能包含字母或数字
  if (/^[a-zA-Z0-9]{6,10}$/.test(value)) {
    callback()
  } else {
    callback(new Error('密码需为6~10位字母或数字'))
  }
}

//定义表单校验需要的对象
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  padding: 40px;
}
.login_form {
  position: relative;
  top: 30vh;
  width: 80%;
  background: no-repeat;
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }
}
.login_btn {
  width: 100%;
}
</style>
