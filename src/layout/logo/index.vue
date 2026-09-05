<template>
  <div class="logo">
    <img :src="setting.logo" v-if="setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 20px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-logo-title-fontsize;
    margin-left: 10px;
  }
}
</style>
