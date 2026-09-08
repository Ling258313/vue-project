<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select style="width: 240px" v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 240px" v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row }">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.imgUrl"
              fit="fill"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center"
          prop="imgName"
        ></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type TableInstance } from 'element-plus'
// 平台属性：attrInfoList 接口
import { reqAttr } from '@/api/product/attr'
import type { AttrResponseData } from '@/api/product/attr/type'
import {
  reqSpuHasSaleAttr,
  reqSpuImageList,
  reqAddSku,
} from '@/api/product/spu'
import type {
  SaleAttrResponseData,
  SkuAttr,
  SkuData,
  SkuSaleAttr,
  SpuData,
  SpuHasImg,
  SpuImg,
} from '@/api/product/spu/type'

// 自定义事件：保存成功后通知父组件回列表
const $emit = defineEmits(['changeScene'])

// 平台属性
const attrArr = ref<SkuAttr[]>([])
// 销售属性
const saleArr = ref<SkuSaleAttr[]>([])
// 照片墙数据（该 SPU 下的图片）
const imgArr = ref<SpuImg[]>([])
// el-table 组件实例：用于"设置默认"时控制勾选
const table = ref<TableInstance>()

// 收集 SKU 的参数
const skuParams = reactive<SkuData>({
  category3Id: '', // 三级分类的ID
  spuId: '', // 已有 SPU 的 ID
  tmId: '', // SPU 品牌 ID
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
  // 照片墙图片：保存时组装成 skuImageList 随请求提交（后端据此生成 sku_image 记录）
  skuImageList: [],
})

// 对外暴露：父组件在"添加 SKU"时调用初始化
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  // 收集公共数据
  skuParams.category3Id = spu.category3Id as string | number
  skuParams.spuId = spu.id as number | string
  skuParams.tmId = spu.tmId as string | number
  // 该分类下全部平台属性（属性管理接口）
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
  // 该 SPU 下全部销售属性（含属性值）
  const result1: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  if (result1.code === 200) {
    saleArr.value = result1.data
  }
  // 该 SPU 下全部图片
  const result2: SpuHasImg = await reqSpuImageList(spu.id as number)
  if (result2.code === 200) {
    imgArr.value = result2.data
  }
}

// 设置默认图片：勾选该行并记录图片地址
const handler = (row: SpuImg) => {
  table.value?.clearSelection()
  table.value?.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存
const save = async () => {
  // 整理平台属性：选中才收，"attrId:valueId"
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  // 整理销售属性："saleAttrId:saleAttrValueId"
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )
  // 组装 SKU 图片列表：把该 SPU 照片墙的全部图片随 SKU 一起提交
  skuParams.skuImageList = imgArr.value.map((item) => ({
    imgName: item.imgName,
    imgUrl: item.imgUrl,
    spuImgId: item.id,
    // 当前设为默认图的那张标记为 1，其余为 0
    isDefault: item.imgUrl === skuParams.skuDefaultImg ? '1' : '0',
  }))

  const result: any = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '添加SKU成功' })
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({ type: 'error', message: '添加SKU失败' })
  }
}

// 取消
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

defineExpose({ initSkuData })
</script>

<style scoped></style>
