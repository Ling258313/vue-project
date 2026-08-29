/// <reference types="vite/client" />

// vite-plugin-svg-icons 虚拟模块类型声明
declare module 'virtual:svg-icons-register' {
  const src: string
  export default src
}

// 自定义环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
