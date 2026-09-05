import type { MockMethod } from 'vite-plugin-mock'

// 用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar: '/logo.png', // public 目录下的资源通过根路径访问
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}

export default [
  // 用户登录
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      // 获取请求体携带的用户名和密码
      const { username, password } = body
      // 查找用户信息
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )
      // 没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      // 如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      // 获取请求头携带的 token
      const token = request.headers.token
      // 查看用户信息是否包含有该 token 的用户
      const checkUser = createUserList().find((item) => item.token === token)
      // 没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      // 如果有返回成功信息
      return { code: 200, data: { checkUser } }
    },
  },
] as MockMethod[]
