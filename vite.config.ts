import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteMockServe({ mockPath: 'mock' }),
      createSvgIconsPlugin({
        // 指定要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定 symbolId 格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    server: {
      watch: {
        // 忽略编辑器/工具原子保存产生的临时文件，避免 Windows 上 EBUSY 崩溃
        ignored: [/.tmpdir[\/]/, /.tmp$/],
      },
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 自动把全局变量注入到所有 scss 文件，无需手动 import
          additionalData: '@use "@/styles/variable.scss" as *;',
        },
      },
    },
  }
})
