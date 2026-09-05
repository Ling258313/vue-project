// 创建布局相关的小仓库（折叠状态等）
import { defineStore } from 'pinia'

const useLayoutStore = defineStore('Layout', {
  state: () => ({
    // 侧边栏是否折叠（全局唯一事实来源）
    isCollapse: false,
  }),
  actions: {
    // 切换折叠状态
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
  getters: {},
})
// 对外暴露获取小仓库的方法
export default useLayoutStore
