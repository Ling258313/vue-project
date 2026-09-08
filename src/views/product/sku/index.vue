<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <el-card>
      <!-- 已有 SKU 数据展示表格 -->
      <el-table border style="margin: 10px 0px" :data="skuArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="名称"
          show-overflow-tooltip
          width="150px"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          show-overflow-tooltip
          prop="skuDesc"
        ></el-table-column>
        <el-table-column label="默认图片" width="150px">
          <template #="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="height: 100px; width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          width="150px"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格"
          width="150px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作" width="250px" fixed="right">
          <template #="{ row }">
            <!-- 上架/下架：isSale==1(已上架) 显示 Bottom 表示下架，否则显示 Top 表示上架 -->
            <el-button
              type="primary"
              size="small"
              :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
              title="上架/下架"
              @click="updateSale(row)"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              title="修改SKU"
              @click="updateSku"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="InfoFilled"
              title="查看详情"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除 ${row.skuName} ?`"
              width="200px"
              @confirm="deleteSku(row)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                  title="删除SKU"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasSku"
      />
    </el-card>

    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo?.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo?.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo?.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo?.skuAttrValueList"
              :key="item.id"
              style="margin: 5px 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo?.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo?.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 引入 SKU 模块接口
import {
  reqCancelSale,
  reqRemoveSku,
  reqSaleSku,
  reqSkuInfo,
  reqSkuList,
} from '@/api/product/sku'
// 引入 ts 类型
import type {
  SkuData,
  SkuInfoData,
  SkuResponseData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
// SKU 数据总条数
let total = ref<number>(0)
// 当前页已有的 SKU 数据
let skuArr = ref<SkuData[]>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 商品详情数据
let skuInfo = ref<SkuData>()

// 组件挂载完毕：获取第一页数据
onMounted(() => {
  getHasSku()
})

// 获取已有 SKU（分页）
const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器每页条数变化触发
const handleSizeChange = () => {
  getHasSku()
}

// 商品的上架与下架
const updateSale = async (row: SkuData) => {
  // 如果当前商品的 isSale === 1，说明已上架 -> 更新为下架
  if (row.isSale === 1) {
    const result = await reqCancelSale(row.id as number)
    if (result.code == 200) {
      ElMessage({ type: 'success', message: '商品下架成功' })
    }
    // 发请求获取更新后的 SKU 数据
    getHasSku(pageNo.value)
  } else {
    const result = await reqSaleSku(row.id as number)
    if (result.code == 200) {
      ElMessage({ type: 'success', message: '商品上架成功' })
    }
    getHasSku(pageNo.value)
  }
}

// 更新已有 SKU（课程中暂未实现，占位提示）
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力的建设中...' })
}

// 查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  // 获取商品详情数据
  const result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}

// 删除商品
const deleteSku = async (row: SkuData) => {
  const result = await reqRemoveSku(row.id as number)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '商品删除成功' })
    // 当前页删空则页码回退，否则留在当前页刷新
    getHasSku(skuArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '商品删除失败' })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
