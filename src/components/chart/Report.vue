<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item to="/reports">数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      数据报表
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Report'
}
</script>

<style scoped>

</style>
