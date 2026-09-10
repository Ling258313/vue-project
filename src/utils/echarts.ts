// ECharts 按需引入：只打包项目实际用到的图表/组件/渲染器
// 对比 import * as echarts from 'echarts'（全量 20+ 种图表），体积能省一半以上
import * as echarts from 'echarts/core'

// ---------- 图表类型（按项目需要加） ----------
import {
  BarChart, // 柱状图/条形图：男女比例、年度游客、排行
  LineChart, // 折线图：游客趋势、排行的趋势线
  LinesChart, // 飞线图：地图上的航线
  MapChart, // 地图（配合 registerMap 使用）
  PieChart, // 饼图：年龄分布
  RadarChart, // 雷达图：总游客量
  ScatterChart, // 散点图：年度游客分布
} from 'echarts/charts'

// ---------- 通用组件（坐标系、提示、图例等） ----------
import {
  DataZoomComponent, // 区域缩放
  DatasetComponent, // 数据集
  GeoComponent, // 地理坐标系
  GridComponent, // 直角坐标系
  LegendComponent, // 图例
  MarkLineComponent, // 标线
  RadarComponent, // 雷达坐标系
  TitleComponent, // 标题
  TooltipComponent, // 提示框
  TransformComponent, // 数据转换
  VisualMapComponent, // 视觉映射
} from 'echarts/components'

// ---------- 特性与渲染器 ----------
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 注册：import 本文件即完成注册，全局只执行一次
echarts.use([
  BarChart,
  LineChart,
  LinesChart,
  MapChart,
  PieChart,
  RadarChart,
  ScatterChart,
  DataZoomComponent,
  DatasetComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

// 说明：echarts-liquidfill（水球图）这类扩展插件内部用的是同一份 echarts core，
// 只要在组件里 import 'echarts-liquidfill' 就会注册进上面的实例，无需在 use 里声明。

export default echarts
