<template>
  <div>
    <el-button @click="logout" plain type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function () {
      // 清空sessionStorage
      window.sessionStorage.clear()
      // 重定向到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
