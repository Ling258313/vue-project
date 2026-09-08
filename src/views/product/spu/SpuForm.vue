<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 240px" v-model="spuParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:file-list: 展示默认图片；action: 上传接口
           list-type="picture-card": 照片墙；on-preview/on-remove/on-success: 钩子 -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
        :on-success="handleSuccess"
        :headers="headers"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <!-- 预览图片的对话框 -->
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 选择还未拥有的销售属性 -->
      <el-select
        style="width: 240px"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
        v-model="saleAttrIdAndValueName"
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="saleAttrIdAndValueName ? false : true"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row 即为当前 SPU 已有的销售属性对象 -->
          <template #="{ row }">
            <el-tag
              v-for="(item, $index) in row.spuSaleAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
              closable
              @close="row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag === true"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  AllTradeMark,
  HasSaleAttrResponseData,
  SaleAttrResponseData,
  SaleAttr,
  SaleAttrValue,
  SpuData,
  SpuHasImg,
  Trademark,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqAllSaleAttr,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
// 上传图片需要携带 Token
import useUserStore from '@/store/moudules/user'

// 自定义事件：通知父组件切换场景（0=回列表）
const $emit = defineEmits(['changeScene'])

// 用户仓库：拿 token 拼上传请求头
const userStore = useUserStore()
const headers = { Token: userStore.token }

// 存储已有的 SPU 数据
const allTradeMark = ref<Trademark[]>([])
// 商品图片（照片墙）
const imgList = ref<any[]>([])
// 已有的销售属性
const saleAttr = ref<SaleAttr[]>([])
// 项目全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
// 控制图片预览对话框
const dialogVisible = ref<boolean>(false)
// 存储预览图片地址
const dialogImageUrl = ref<string>('')
// 存储已有的 SPU 对象
const spuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
// 下拉框选中的"销售属性id:名称"
const saleAttrIdAndValueName = ref<string>('')

// ---------- 对外暴露：父组件调用 ----------
// 添加 SPU 前的初始化：清空 + 拉品牌/全部销售属性
const initAddSpu = async (c3Id: number | string) => {
  Object.assign(spuParams.value, {
    id: 0,
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  spuParams.value.category3Id = c3Id

  // 全部品牌
  const result: AllTradeMark = await reqAllTradeMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }
  // 全部销售属性
  const result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  if (result2.code === 200) {
    allSaleAttr.value = result2.data
  }
}

// 修改 SPU 的回显：父组件把行数据传进来，拉图片/已有销售属性
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有 SPU 对象
  spuParams.value = spu
  // 全部品牌
  const result: AllTradeMark = await reqAllTradeMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }
  // 该 SPU 下图片列表（后端字段 imgName/imgUrl → 照片墙要 name/url）
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  if (result1.code === 200) {
    imgList.value = result1.data.map((item) => {
      return { name: item.imgName, url: item.imgUrl }
    })
  }
  // 该 SPU 下已有销售属性
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  if (result2.code === 200) {
    saleAttr.value = result2.data
  }
  // 项目全部销售属性
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  if (result3.code === 200) {
    allSaleAttr.value = result3.data
  }
}

defineExpose({ initAddSpu, initHasSpuData })

// ---------- 图片上传相关 ----------
// 上传成功：后端返回 { code, message, data: 图片地址 }，照片墙文件对象上会有 response 字段
const handleSuccess = (response: any, uploadFile: any) => {
  uploadFile.url = response.data
}
// 预览
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
// 删除照片
const handleRemove = () => {
  ElMessage({ type: 'success', message: '图片已删除' })
}
// 上传前校验：格式 png/jpeg/gif 且小于 3M
const handleUpload = (uploadFile: any) => {
  if (
    uploadFile.type === 'image/png' ||
    uploadFile.type === 'image/jpeg' ||
    uploadFile.type === 'image/gif'
  ) {
    if (uploadFile.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({ type: 'error', message: '上传文件务必小于3M' })
      return false
    }
  } else {
    ElMessage({ type: 'error', message: '上传文件务必PNG|JPG|GIF' })
    return false
  }
}

// ---------- 销售属性 ----------
// 计算当前 SPU 还未拥有的销售属性（全部 - 已有的）
const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}

// 点 + 号进入编辑模式
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}

// 输入框失焦：校验非空/不重复后追加属性值
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  if (saleAttrValue?.trim() === '') {
    ElMessage({ type: 'error', message: '属性值不能为空' })
    return
  }
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) {
    ElMessage({ type: 'error', message: '属性值不能重复' })
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

// ---------- 保存 / 取消 ----------
const save = async () => {
  // 1. 整理照片墙数据：新上传的取 response.data，已有回显的取 url
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2. 整理销售属性
  spuParams.value.spuSaleAttrList = saleAttr.value

  const result: any = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
    $emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消：回列表场景
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
</script>

<style scoped></style>
