import { defineStore } from 'pinia'

let useLayoutSettingsStore = defineStore('settings', {
  state: () => {
    return {
      fold: false, //用户控制菜单是否折叠还是收起控制
      refsh: false, //仓库这个属性用于控制刷新效果
    }
  },
})

export default useLayoutSettingsStore
