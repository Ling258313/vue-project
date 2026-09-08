<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 三级分类联动组件 -->
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0px">
      <!-- 场景 0：展示已有 SPU 数据 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>

        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="getSku(row)"
              ></el-button>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除SPU"
                @click="deleteSpu(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>

      <!-- 场景 1：添加 / 修改 SPU 的子组件 -->
      <SpuForm
        v-show="scene === 1"
        ref="spu"
        @changeScene="changeScene"
      ></SpuForm>

      <!-- 场景 2：添加 SKU 的子组件 -->
      <SkuForm
        v-show="scene === 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>

      <!-- 对话框：展示某个 SPU 下已有的 SKU 列表 -->
      <el-dialog v-model="dialogVisible" title="SKU列表">
        <el-table :data="skuArr" border>
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// 引入子组件
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
// 引入获取分类的仓库
import useCategoryStore from '@/store/moudules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  Records,
  HasSpuResponseData,
  SkuData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

// 场景：0 = 展示已有 SPU；1 = 添加/修改 SPU；2 = 添加 SKU
const scene = ref<number>(0)
const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const records = ref<Records>([])
const total = ref<number>(0)
// 子组件实例（调用其 init 方法初始化数据）
const spu = ref<InstanceType<typeof SpuForm>>()
const sku = ref<InstanceType<typeof SkuForm>>()
// 查看 SKU 列表用
const skuArr = ref<SkuData[]>([])
const dialogVisible = ref<boolean>(false)

// 监听三级分类变化 → 重新获取该分类下 SPU
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 获取某一个三级分类下全部已有 SPU（分页）
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器每页条数变化
const changeSize = () => {
  getHasSpu()
}

// ---------- 场景切换 ----------
// 子组件通过 changeScene 事件通知父组件：{ flag, params }
// flag: 目标场景；params: 'add' 新增后回第一页 / 'update' 修改后留在当前页
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params === 'add') {
    getHasSpu()
  } else if (obj.params === 'update') {
    getHasSpu(pageNo.value)
  }
}

// 添加 SPU：切场景 1 并初始化子组件数据
const addSpu = () => {
  scene.value = 1
  spu.value?.initAddSpu(categoryStore.c3Id)
}

// 修改 SPU：切场景 1 并回显
const updateSpu = (row: any) => {
  scene.value = 1
  spu.value?.initHasSpuData(row)
}

// 添加 SKU：切场景 2 并初始化
const addSku = (row: any) => {
  scene.value = 2
  sku.value?.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看该 SPU 下全部 SKU（对话框）
const getSku = async (row: any) => {
  const result: any = await reqSkuList(row.id)
  if (result.code === 200) {
    skuArr.value = result.data
    dialogVisible.value = true
  }
}

// 删除 SPU（二次确认后调接口）
const deleteSpu = async (row: any) => {
  const result: any = await reqRemoveSpu(row.id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasSpu(records.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>

<style scoped></style>
