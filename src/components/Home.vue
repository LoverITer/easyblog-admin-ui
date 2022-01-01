<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>Header
      <el-button plain type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <!--主体-->
        <el-main>Main</el-main>
        <!--footer-->
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
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
.home-container{
  height: 100%;
}

.el-header {
  background-color: #373d41;
}

.el-aside {
  background-color: #333744;
}

.el-main{
  background-color: #eaedf1;
}

</style>
