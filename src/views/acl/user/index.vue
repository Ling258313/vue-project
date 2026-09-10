<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 卡片一：搜索区域 -->
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入搜索用户名" v-model="keyword"></el-input>
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

    <!-- 卡片二：用户列表 -->
    <el-card style="margin: 10px 0px">
      <el-button
        v-has="'btn.User.add'"
        type="primary"
        size="default"
        @click="addUser"
      >
        添加用户
      </el-button>
      <el-button
        v-has="'btn.User.remove'"
        type="primary"
        size="default"
        :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- table 展示用户信息 -->
      <el-table
        border
        style="margin: 10px 0px"
        :data="userArr"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row }">
            <el-button
              v-has="'btn.User.assgin'"
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              v-has="'btn.User.update'"
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除${row.username}？`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button
                  v-has="'btn.User.remove'"
                  type="primary"
                  size="small"
                  icon="Delete"
                >
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
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasUser"
      />
    </el-card>

    <!-- 抽屉一：添加新的用户账号 ｜ 更新已有账号信息 -->
    <el-drawer v-model="drawer" direction="rtl">
      <!-- 标题动态：有 id 是更新，没有是添加 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <!-- 密码只在添加时显示：更新账号不需要改密码 -->
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 抽屉二：给某一个已有账号分配角色 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示角色复选框 -->
            <el-checkbox-group
              v-model="checkedRole"
              @change="handleCheckedRoleChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :value="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
// 引入用户管理接口
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveBatchUser,
  reqRemoveUser,
  reqSetUserRole,
  reqUserList,
} from '@/api/acl/user'
// 引入 ts 类型
import type { Records, User, UserResponseData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 布局小仓库：重置按钮借助 refsh 触发当前页组件重建
import useLayoutSettingsStore from '@/store/moudules/settings'

let layoutSettingStore = useLayoutSettingsStore()

// 搜索关键字
let keyword = ref<string>('')
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(5)
// 用户数据总条数
let total = ref<number>(0)
// 当前页已有的用户列表
let userArr = ref<Records>([])
// 批量删除：选中的用户集合
let selectIdArr = ref<User[]>([])

// 抽屉一（添加｜更新用户）显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户表单数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// el-form 实例：用于表单校验与清除校验提示
let formRef = ref<any>()

// 抽屉二（分配角色）显示与隐藏
let drawer1 = ref<boolean>(false)
// 全部角色
// 注：el-checkbox 的 value 只接受 string|number|boolean，这里承载的是角色对象，故放宽为 any[]
let allRole = ref<any[]>([])
// 当前用户已有的角色
let checkedRole = ref<any[]>([])
// 全选复选框状态
let checkAll = ref<boolean>(false)
// 复选框半选状态（只控制样式）
let isIndeterminate = ref<boolean>(true)

// 获取已有用户数据（分页 + 用户名关键字）
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  const result: UserResponseData = await reqUserList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器每页条数变化触发
const handleSizeChange = () => {
  getHasUser()
}

// 搜索按钮回调
const search = () => {
  // 按当前关键字查询：页码回到第一页，且关键字保留，
  // 这样翻页/切每页条数时依然带着过滤条件（清空请点"重置"）
  getHasUser()
}

// 重置按钮回调：切换 refsh → 布局重建当前页组件，关键字与列表回到初始状态
const reset = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

// 表格复选框勾选变化触发
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 添加用户按钮回调
const addUser = () => {
  // 显示抽屉
  drawer.value = true
  // 清空表单数据（id 为 0 → 走添加接口）
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误提示
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有用户按钮回调：row 是当前行用户信息
const updateUser = (row: User) => {
  drawer.value = true
  // 回显已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误提示
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存按钮回调：添加新的账号 或 更新已有账号
const save = async () => {
  // 表单校验（不通过会抛出异常，下面的代码不再执行）
  await formRef.value.validate()
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 课程原样：刷新浏览器拿到最新列表（也可以改成 getHasUser(...) 局部刷新）
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消按钮回调
const cancel = () => {
  drawer.value = false
}

// 校验用户姓名：至少五位
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

// 校验用户昵称：至少五位
const validatorName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

// 校验用户密码：至少六位
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

// 表单校验规则
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按钮回调
const setRole = async (row: User) => {
  // 存储当前用户信息
  Object.assign(userParams, row)
  // 获取全部角色 + 该用户已有的角色
  const result = await reqAllRole(userParams.id as number)
  if (result.code === 200) {
    allRole.value = result.data.allRolesList
    checkedRole.value = result.data.assignRoles
    drawer1.value = true
    // 全选状态：已有角色数 === 全部角色数
    checkAll.value = allRole.value.length === checkedRole.value.length
    isIndeterminate.value =
      checkedRole.value.length > 0 &&
      checkedRole.value.length < allRole.value.length
  }
}

// 全选复选框 change 事件
const handleCheckAllChange = (val: any) => {
  checkedRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

// 底部角色复选框 change 事件
const handleCheckedRoleChange = (value: any) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

// 分配角色确定按钮回调
const confirmClick = async () => {
  // 整理参数：userId + 角色 id 数组
  const data = {
    userId: userParams.id as number,
    roleIdList: checkedRole.value.map((item) => item.id as number),
  }
  const result = await reqSetUserRole(data)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    // 获取更新后的用户数据，留在当前页
    getHasUser(pageNo.value)
  }
}

// 删除某一个账号
const deleteUser = async (userId: number) => {
  const result = await reqRemoveUser(userId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 当前页删空则页码回退，否则留在当前页刷新
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// 批量删除按钮回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数：勾选用户的 id 数组
  const idsList: number[] = selectIdArr.value.map((item) => item.id as number)
  const result = await reqRemoveBatchUser(idsList)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 当前页删空则页码回退，否则留在当前页刷新
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// 组件挂载完毕：获取第一页数据
onMounted(() => {
  getHasUser()
})
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
