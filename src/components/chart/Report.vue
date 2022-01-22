<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item to="/reports">数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--图标区域-->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Report',
  data () {
    return {
      //图片数据配置
      chart_options: {}
    }
  },
  mounted () {
    //DOM元素准备好了
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById('main'),'dark')
    this.$http.get('reports/type/1').then(response => {
      let resp = response.data
      if (resp.meta.status !== 200) {
        return this.$message.error('获取图表数据失败！')
      }
      this.chart_options = resp.data
      myChart.setOption(resp.data)
    })
  }
}
</script>

<style scoped>

</style>
