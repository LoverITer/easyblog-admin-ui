<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/goods">商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="输入查询内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column fixed="left" label="ID" prop="goods_id" :width="50"></el-table-column>
        <el-table-column fixed="left" label="商品名称" prop="goods_name" :width="350"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" :width="110"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="商品状态" prop="goods_state" :width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_state===0" type="primary">审核未通过</el-tag>
            <el-tag v-else-if="scope.row.goods_state===1" type="primary">审核中</el-tag>
            <el-tag v-else-if="scope.row.goods_state===2" type="primary">已审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否热销品" prop="is_promote" :width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_promote===true" type="primary">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="热销品数量" prop="hot_mumber" :width="100"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"  :width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="upd_time" :width="200">
          <template slot-scope="scope">
            {{scope.row.upd_time | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" :width="185">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @size-change="pageSizeChangeRefresh"
                     @current-change="currentPageChangeRefresh"
                     :current-page="queryGoodsRequest.pagenum"
                     :page-sizes="[10, 20, 30, 50,100]"
                     :page-size="queryGoodsRequest.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="goodsTotal">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      //分页查询参数
      queryGoodsRequest: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //商品列表
      goodsList: [],
      //总记录条数
      goodsTotal: 0
    }
  },
  methods: {
    getGoodsList () {
      this.$http.get('goods', {
        params: this.queryGoodsRequest
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        console.log(response)
        this.goodsList = resp.data.goods
        this.goodsTotal = resp.data.total
      })
    },
    pageSizeChangeRefresh (newSize) {
      this.queryGoodsRequest.pagesize = newSize
      this.getGoodsList()
    },
    currentPageChangeRefresh (newPage) {
      this.queryGoodsRequest.pagenum = newPage
      this.getGoodsList()
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style scoped>

</style>
