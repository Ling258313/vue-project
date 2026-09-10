<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 菜单数据：树形表格（row-key + children 自动渲染成树） -->
    <el-table
      :data="PermissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <!-- 三个操作按钮：事件与弹窗在后续小节接入 -->
          <!-- 四级（按钮）下面不能再加子节点 -->
          <el-button
            v-has="'btn.Permission.add'"
            type="primary"
            size="small"
            :disabled="row.level == 4 ? true : false"
            @click="addPermission(row)"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <!-- 一级菜单不允许编辑/删除 -->
          <el-button
            v-has="'btn.Permission.update'"
            type="primary"
            size="small"
            :disabled="row.level == 1 ? true : false"
            @click="updatePermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除${row.name}？`"
            width="260px"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button
                v-has="'btn.Permission.remove'"
                type="primary"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框：添加子菜单 ｜ 更新已有菜单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="menuData.id ? '更新菜单' : '添加菜单'"
      width="500"
    >
      <el-form>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入菜单名称"
            v-model="menuData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限值" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入权限值"
            v-model="menuData.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
// 引入菜单管理接口
import {
  reqAddOrUpdateMenu,
  reqAllPermisson,
  reqRemoveMenu,
} from '@/api/acl/menu'
// 引入 ts 类型
import type {
  MenuParams,
  Permission,
  PermissionList,
  PermissionResponsData,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 存储菜单数据
let PermissionArr = ref<PermissionList>([])
// 对话框（添加｜更新菜单）显示与隐藏
let dialogVisible = ref<boolean>(false)
// 携带给后端的新增｜修改参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
// 表单项 label 宽度
const formLabelWidth = '80px'

// 获取已有菜单数据
const getHashPermission = async () => {
  const result: PermissionResponsData = await reqAllPermisson()
  if (result.code === 200) {
    PermissionArr.value = result.data
  }
}

// 添加菜单｜添加功能按钮回调：row 是当前行菜单数据
const addPermission = (row: Permission) => {
  // 清空数据（id 为 0 → 走添加接口）
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  // 显示对话框
  dialogVisible.value = true
  // 新增的子节点层级 = 当前层级 + 1
  menuData.level = row.level + 1
  // 新增的子节点父级 = 当前行 id
  menuData.pid = row.id
}

// 编辑已有菜单按钮回调
const updatePermission = (row: Permission) => {
  // 回显已有菜单数据
  Object.assign(menuData, row)
  // 显示对话框
  dialogVisible.value = true
}

// 确定按钮回调：添加子菜单 或 更新已有菜单
const save = async () => {
  const result = await reqAddOrUpdateMenu(menuData)
  if (result.code === 200) {
    // 关闭对话框
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    // 重新获取最新的菜单树
    getHashPermission()
  }
}

// 删除菜单
const removeMenu = async (id: number) => {
  const result = await reqRemoveMenu(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取最新的菜单树
    getHashPermission()
  }
  // 非 200（比如该节点下有子节点 → 208「该节点下有子节点，不可以删除」）由请求拦截器统一弹出提示
}

// 组件挂载完毕：获取全部菜单数据
onMounted(() => {
  getHashPermission()
})
</script>

<style scoped></style>
