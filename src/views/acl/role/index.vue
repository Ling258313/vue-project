<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 卡片一：角色搜索 -->
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色搜索">
          <el-input
            placeholder="请输入搜索角色名称"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 搜索按钮：关键字为空时禁用 -->
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 卡片二：角色列表 -->
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">
        添加角色
      </el-button>
      <el-table border style="margin: 10px 0px" :data="allRole">
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          show-overflow-tooltip
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          show-overflow-tooltip
          prop="updateTime"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template #="{ row }">
            <!-- 三个操作按钮：弹窗与事件在后续小节接入 -->
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setPermission(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除角色：${row.roleName}?`"
              width="260px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
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
        @current-change="getHasRole"
      />
    </el-card>

    <!-- 对话框：添加角色 ｜ 更新已有角色 -->
    <el-dialog
      v-model="dialogVisite"
      :title="roleParams.id ? '更新角色' : '添加角色'"
    >
      <el-form :model="roleParams" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请输入角色名称"
            v-model="roleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="dialogVisite = false">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>

    <!-- 抽屉：给角色分配菜单权限与按钮权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <!-- 树形控件：node-key 用 id，节点文字取 name -->
        <el-tree
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
// 引入角色管理接口
import {
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqAllRoleList,
  reqRemoveRole,
  reqSetPermission,
} from '@/api/acl/role'
// 引入 ts 类型
import type {
  MenuList,
  MenuResponseData,
  Records,
  RoleData,
  RoleResponseData,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

// 角色搜索关键字
let keyword = ref<string>('')
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
// 角色总个数
let total = ref<number>(0)
// 当前页已有的角色数据
let allRole = ref<Records>([])
// 对话框（添加｜更新角色）显示与隐藏
let dialogVisite = ref<boolean>(false)
// 收集角色表单数据
let roleParams = reactive<RoleData>({
  roleName: '',
})
// el-form 实例：用于表单校验与清除校验提示
let form = ref<any>()
// 抽屉（分配权限）显示与隐藏
let drawer = ref<boolean>(false)
// 菜单与按钮权限数据
let menuArr = ref<MenuList>([])
// 该角色已有权限的叶子节点 id
let selectArr = ref<number[]>([])
// el-tree 实例：用于获取勾选/半选的节点
let tree = ref<any>()
// 树形控件字段映射：子节点取 children，显示文字取 name
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 获取已有角色（分页 + 角色名称关键字）
const getHasRole = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 分页器每页条数变化触发
const handleSizeChange = () => {
  getHasRole()
}

// 搜索按钮回调：按当前关键字查询，页码回到第一页（关键字保留，翻页仍带过滤）
const search = () => {
  getHasRole()
}

// 重置按钮回调：清空关键字并重新获取全部角色
const reset = () => {
  keyword.value = ''
  getHasRole()
}

// 添加角色按钮回调
const addRole = () => {
  dialogVisite.value = true
  // 清空表单数据（id 为 0 → 走添加接口）
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
  })
  // 清除上一次的校验提示
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}

// 更新已有角色按钮回调：row 是当前行角色数据
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  // 回显整行数据（含 remark，否则后端 update 会把备注覆盖为空）
  Object.assign(roleParams, row)
  // 清除上一次的校验提示
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}

// 校验角色名称：至少两位
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('角色名称至少两位'))
  }
}

// 表单校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 确定按钮回调：添加新角色 或 更新已有角色
const save = async () => {
  // 表单校验（不通过会抛出异常，下面的代码不再执行）
  await form.value?.validate()
  const result = await reqAddOrUpdateRole(roleParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    })
    // 更新：留在当前页；添加：回到第一页
    getHasRole(roleParams.id ? pageNo.value : 1)
    dialogVisite.value = false
  }
}

// 递归过滤出该角色已有权限的叶子节点 id（父节点交给 el-tree 自动半选/全选）
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 分配权限按钮回调：row 是当前行角色数据
const setPermission = async (row: RoleData) => {
  // 显示抽屉
  drawer.value = true
  // 收集当前要分配权限的角色数据
  Object.assign(roleParams, row)
  // 根据角色 id 获取菜单与按钮权限数据
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    // 回显已有权限
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

// 抽屉确定按钮回调：下发权限
const confirmClick = async () => {
  // 角色 ID
  const roleId = roleParams.id as number
  // 勾选的节点 + 半选的节点（父节点一起提交，菜单树才完整）
  const checkedKeys = tree.value?.getCheckedKeys() || []
  const halfCheckedKeys = tree.value?.getHalfCheckedKeys() || []
  const permissionId = checkedKeys.concat(halfCheckedKeys)
  const result = await reqSetPermission(roleId, permissionId as number[])
  if (result.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })
    // 刷新角色列表（课程里用的是 window.location.reload()）
    getHasRole(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配权限失败',
    })
  }
}

// 删除已有角色
const removeRole = async (roleId: number) => {
  const result = await reqRemoveRole(roleId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除角色成功',
    })
    // 当前页删空则页码回退，否则留在当前页刷新
    getHasRole(allRole.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除角色失败',
    })
  }
}

// 组件挂载完毕：获取第一页数据
onMounted(() => {
  getHasRole()
})
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
