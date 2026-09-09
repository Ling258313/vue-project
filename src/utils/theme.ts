// 主题（暗黑模式 + 主题色）工具：读写本地存储、应用到 html 根节点

// 本地存储 key
const DARK_KEY = 'theme_dark'
const COLOR_KEY = 'theme_color'

// 读取暗黑模式开关（'1' 表示开启）
export const GET_DARK = () => localStorage.getItem(DARK_KEY) === '1'

// 保存暗黑模式开关
export const SET_DARK = (value: boolean) =>
  localStorage.setItem(DARK_KEY, value ? '1' : '0')

// 读取主题色（没设置过返回空字符串）
export const GET_COLOR = () => localStorage.getItem(COLOR_KEY) || ''

// 保存主题色
export const SET_COLOR = (color: string) =>
  localStorage.setItem(COLOR_KEY, color)

// 应用暗黑模式：给 html 根节点加/去 dark 类名（EP 的暗黑变量靠它生效）
export const applyDark = (value: boolean) => {
  document.documentElement.classList.toggle('dark', value)
}

// 应用主题色：主色 + 由主色推导的浅色/深色变体
// （EP 的按钮 hover、朴素按钮背景等用的是 --el-color-primary-light-N）
export const applyColor = (color: string) => {
  const el = document.documentElement
  // 空字符串 = 恢复默认主色：清掉内联变量即可
  if (!color) {
    el.style.removeProperty('--el-color-primary')
    for (let i = 1; i <= 9; i++) {
      el.style.removeProperty(`--el-color-primary-light-${i}`)
    }
    el.style.removeProperty('--el-color-primary-dark-2')
    return
  }
  // 主色
  el.style.setProperty('--el-color-primary', color)
  // 浅色变体：向"当前主题的背景色"混合 —— 亮色模式偏白、暗黑模式偏黑，两种模式都自然
  for (let i = 1; i <= 9; i++) {
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      `color-mix(in srgb, ${color} ${100 - i * 10}%, var(--el-bg-color))`,
    )
  }
  // 深色变体：向黑色混合
  el.style.setProperty(
    '--el-color-primary-dark-2',
    `color-mix(in srgb, ${color} 80%, black)`,
  )
}

// 应用本地保存的主题（应用启动时调用一次，刷新后保持上次的选择）
export const initTheme = () => {
  applyDark(GET_DARK())
  applyColor(GET_COLOR())
}
