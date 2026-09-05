<template>
  <!-- 注意：外层需要一个单根 div 包裹（el-card + el-dialog 是两块内容），
       否则页面是多根节点，套在布局的 <transition mode="out-in"> 里时
       退场动画无法完成，会导致"离开本页后 main 区域空白" -->
  <div class="trademark">
    <el-card class="box-card">
      <!-- 卡片顶部的添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <!-- 
            table
            ---border:可以设置表格纵向是否有边框
            table-column
            ---label：某一个列表
            ---width:设置这列宽度
            ---align:设置这一列对齐方式
          -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <pre style="">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌Logo">
          <template #="{ row }">
            <img
              :src="row.logoUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="removeTrademark(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件
            pagination
            v-model:current-page: 设置分页器当前页码
            v-model:page-size: 设置每一个展示数据条数
            page-sizes: 用于设置下拉菜单数据
            background: 设置分页器按钮的背景颜色
            layout: 可以设置分页器六个子组件布局调整
          -->
      <el-pagination
        :pagecount="9"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 对话框组件：在添加品牌跟已有品牌的业务时候使用结构 -->
    <!-- v-model：用于用户控制对话框的显示与隐藏
        title：设置对话框左上角标题 
   -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '新增品牌'"
    >
      <el-form
        ref="formRef"
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="80px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 引入组合式 API 函数 ref
import { ref, onMounted, reactive } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'
// 上传品牌 logo 需要携带 Token（后端所有接口都鉴权）
import useUserStore from '@/store/moudules/user'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示多少条数据
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
//控制对话框的隐藏与显示
let dialogFormVisible = ref<boolean>(false)
// 表单实例：点"确定"时用它触发整体校验
let formRef = ref()
// 定义收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 上传用的用户仓库和请求头（后端从 Header 的 Token 读取）
let userStore = useUserStore()
const uploadHeaders = { Token: userStore.token }
// 上传成功后回显的图片地址
let imageUrl = ref<string>('')
//发请求的函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//组件挂在完毕的钩子---发请求
onMounted(() => {
  getHasTrademark()
})
//对于当前页码的自定义组件，组件pagination实际上是父组件回传数据（当前的页码）
// const changePageNo =()=>{
//     //当前页码发生变化的时候再次发送请求获取对应已有品牌数据展示
//     getHasTrademark();
// }

const sizeChange = () => {
  getHasTrademark()
}
//添加品牌按钮的回调
const addTrademark = () => {
  // 打开对话框前清空上一次残留的数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  imageUrl.value = ''
  //对话框显示
  dialogFormVisible.value = true
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
//修改已有品牌按钮的回调
const updateTrademark = (row: TradeMark) => {
  // 回显：把要修改那行的数据拷贝到表单
  Object.assign(trademarkParams, row)
  //对话框显示
  dialogFormVisible.value = true
}
// 上传成功回调：后端返回 { code, message, data: 图片地址 }
const handleAvatarSuccess = (response: any) => {
  // 把返回的图片地址存起来：用于回显 + 提交时带给服务器
  imageUrl.value = response.data
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}
// 上传前校验：只允许图片格式，且小于 2MB
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB')
  }
  return isImage && isLt2M
}
//对话框底部确定按钮
const confirm = async () => {
  // 先整体校验：tmName 和 logoUrl 的 validator 都会在这里执行
  // 校验不通过 → validate() 抛错 → 红字提示并直接 return，不发请求
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
    // 刷新列表（回到第一页，让新数据可见）
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    // 清空表单，避免下次打开残留
    trademarkParams.id = undefined
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''
    imageUrl.value = ''
  }
}
//删除按钮的方法
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    // 刷新并保持在当前页（不跳回第一页）
    getHasTrademark(
      trademarkArr.value.length >= 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage.error('删除失败')
  }
}
const cancel = () => {
  dialogFormVisible.value = false
}
const validatorTmName = (_rule: any, value: any, callback: any) => {
  if (value && value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称大于等于两位'))
  }
}

const validatorLogoUrl = (_rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片务必上传'))
  }
}

// 表单校验规则
const rules = {
  tmName: [{ trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ validator: validatorLogoUrl }],
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
