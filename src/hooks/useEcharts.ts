// ECharts 通用封装：一个 Hook 管掉图表的一生（init / setOption / resize / dispose）
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { Ref } from 'vue'
// 按需注册过的 echarts 实例
import echarts from '@/utils/echarts'

/**
 * @param el     图表容器（模板里的 ref）
 * @param option 初始配置项；水球图等扩展系列的配置用 any 承载即可
 * @returns chart 图表实例（shallowRef）、setOption 更新配置、resize 手动自适应
 */
export default function useEcharts(
  el: Ref<HTMLElement | undefined>,
  option: any,
) {
  // 注意用 shallowRef：echarts 实例内部状态很复杂，
  // 用 ref 会被 Vue 深度代理，可能出现渲染异常或性能问题
  const chart = shallowRef<ReturnType<typeof echarts.init>>()

  // 容器尺寸变化时重新计算（大屏用 transform: scale 时不需要，元素像素尺寸没变）
  const resize = () => chart.value?.resize()

  // 更新配置：默认增量合并；换整套数据/图表时传 notMerge = true
  const setOption = (opt: any, notMerge = false) => {
    chart.value?.setOption(opt, notMerge)
  }

  onMounted(() => {
    // 容器必须有宽高，否则图表不显示
    if (!el.value) return
    chart.value = echarts.init(el.value)
    chart.value.setOption(option)
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    // 组件销毁：移除监听 + 销毁实例，避免内存泄漏
    window.removeEventListener('resize', resize)
    chart.value?.dispose()
    chart.value = undefined
  })

  return { chart, setOption, resize }
}
