<template>
  <!-- 注意单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 卡片一：一级 / 二级 / 三级分类联动选择
         （当前是占位骨架；下一步建立分类仓库 categoryStore + 分类接口后，
           再给每个 el-select 加上 v-model="categoryStore.c1Id" 和
           v-for 遍历 option 的联动逻辑） -->
    <!-- 全局组件 -->
    <Category :scene="scene" />
    <!-- 卡片二：平台已有的属性展示 -->
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- 必须用作用域插槽接收 row，按钮里的 updateAttr(row) 才有值 -->
            <template #="{ row }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除：用 el-popconfirm 包一层，点删除按钮先弹确认框，确认后才真正调接口 -->
              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <!-- reference 具名插槽：放触发弹层的按钮 -->
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                @blur="toLook(row, $index)"
                v-if="row.flag"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ $index }">
              <!-- 删除当前行的属性值（只动本地数组，保存时才提交） -->
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/moudules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
//存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
//定义card组件内容的切换变量
let scene = ref<number>(0)
//收集新生的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    // 新增的属性值数组：第一个对象要有 valueName 和 flag，
    // flag:true → 显示输入框；缺 flag 会走 v-else 渲染成空的 div（看起来就是"空行"）
    { valueName: '', flag: true },
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //三级分类
})
// 准备一个数组：存储每一行 el-input 的组件实例（下标和 attrValueList 对齐），用于自动聚焦
let inputArr = ref<any[]>([])
//监听仓库三级的数据变化
watch(
  () => categoryStore.c3Id,
  async () => {
    attrArr.value = []
    //保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return
    //获取分类的id
    getAttr()
  },
)
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
const addAttr = () => {
  scene.value = 1
  attrParams.categoryId = categoryStore.c3Id
  // 新增时清空旧数据（id 置空表示新增）
  attrParams.id = undefined
  attrParams.attrName = ''
  attrParams.attrValueList = [{ valueName: '', flag: true }]
}

const updateAttr = (row: Attr) => {
  scene.value = 1
  // 回显：把要修改那一行的属性与属性值深拷贝到表单（注意 reactive 直接赋值对象会失去响应式，要逐字段或用 Object.assign）
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与展示模式的切换
  })
  // 获取最后 el-input 组件实例并聚焦
  // nextTick：等新行渲染到 DOM 后再取组件（此刻 DOM 还没更新，取不到）
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1]?.focus()
  })
}
//保存按钮的回调
const save = async () => {
  // 收集参数：三级分类的 ID 在进入新增时已写入 attrParams.categoryId
  // 发请求（成功/失败 HTTP 都是 200，业务结果看 code；网络错误/业务非 200 时
  // request 拦截器会 reject，所以用 try/catch 兜住，避免 "Uncaught (in promise)"）
  try {
    let result = await reqAddOrUpdateAttr(attrParams)
    if (result.code == 200) {
      scene.value = 0
      ElMessage({
        type: 'success',
        message: attrParams.id ? '修改成功' : '添加成功',
      })
      // 保存成功后重新拉取列表，让新增/修改的数据立即显示
      getAttr()
    } else {
      ElMessage({
        type: 'error',
        message: attrParams.id ? '修改失败' : '添加失败',
      })
    }
  } catch (error) {
    // 拦截器已经弹过错误提示，这里不用重复弹
  }
}

// 属性值输入框失去焦点时的校验（异常判断）
// 传 $index 进来：校验失败要 splice 掉对应行，需要知道它在数组里的下标
const toLook = (row: AttrValue, $index: number) => {
  // 异常1：属性值为空 → 删除这行并提示
  if (row.valueName.trim() === '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }

  // 异常2：属性值重复 → 删除这行并提示
  // find 从数组里找"另一个" valueName 相同的对象（排除当前 row 自己）
  const repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 把重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }

  // 校验通过：flag 置 false，输入框切换成纯文本展示
  row.flag = false
}
// 点击纯文本 div 进入编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  //相应的1属性值对象标签，展示input
  row.flag = true
  // 切换成输入框后自动聚焦，方便直接改内容
  nextTick(() => {
    inputArr.value[$index]?.focus()
  })
}
const deleteAttr = async (attrId: number) => {
  //发请求
  let result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次剩下已有的属性
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
