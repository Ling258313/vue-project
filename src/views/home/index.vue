<template>
  <!-- 单根 div：页面会被包在布局的 <transition> 里，多根节点会导致切页白屏 -->
  <div>
    <!-- 欢迎卡片：头像 + 问候语 -->
    <el-card>
      <div class="box">
        <img
          :src="userStore.userInfo?.avatar || setting.logo"
          alt=""
          class="avatar"
        />
        <div class="bottom">
          <h3 class="title">{{ time }}好{{ userStore.userInfo?.name }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <!-- 欢迎插画 -->
    <div class="bottom2">
      <SvgIcon name="welcome" :size="500"></SvgIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取"早上 / 上午 / 下午 / 晚上"问候语
import { getTime } from '@/utils/times'
// 引入用户小仓库：拿当前登录用户的头像与昵称
import useUserStore from '@/store/moudules/user'
// 引入项目配置：头像为空时兜底显示 logo
import setting from '@/setting'

// 用户仓库对象
let userStore = useUserStore()
// 问候语（组件加载时算一次）
let time = getTime()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottom2 {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
