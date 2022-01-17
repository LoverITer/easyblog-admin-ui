<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/orders">订单列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>

      <el-row>
        <el-col :span="10">
          <el-input placeholder="输入查询内容" clearable v-model="orderListRequest.query" @keypress.enter.native="getOrderList" @clear="getOrderList">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column label="ID" prop="order_id"></el-table-column>
        <el-table-column label="用户ID" prop="user_id"></el-table-column>
        <el-table-column label="订单数量" prop="order_number" :width="200"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" :width="120"></el-table-column>
        <el-table-column label="支付方式" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay==='0'">未支付</el-tag>
            <el-tag type="primary" v-if="scope.row.order_pay==='1'">支付宝</el-tag>
            <el-tag type="success" v-if="scope.row.order_pay==='2'">微信</el-tag>
            <el-tag type="warning" v-if="scope.row.order_pay==='3'">银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send==='是'" type="success">是</el-tag>
            <el-tag v-if="scope.row.is_send==='否'" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="交易编号" prop="trade_no"></el-table-column>
        <el-table-column label="发票抬头" prop="order_fapiao_title"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" :width="160">
          <template slot-scope="scope">
            {{scope.row.create_time | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time" :width="160">
          <template slot-scope="scope">
            {{scope.row.update_time | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" :width="270">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" icon="el-icon-more">详情</el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @size-change="onPageSizeChange"
                     @current-change="onCurrentPageChange"
                     :current-page="orderListRequest.pagenum"
                     :page-sizes="[10, 20, 30, 50,100]"
                     :page-size="orderListRequest.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data () {
    return {
      //订单数据请求列表
      orderListRequest: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: []  //订单列表
    }
  },
  methods: {
    //获取订单列表
    getOrderList () {
      this.$http.get('orders', { params: this.orderListRequest }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取订单数据失败！')
        }
        this.orderList = resp.data.goods
        this.total = resp.data.total
      })
    },
    //分页大小发生变化处理
    onPageSizeChange(newPageSize){
      this.orderListRequest.pagesize=newPageSize
      this.getOrderList()
    },
    //翻页处理
    onCurrentPageChange(newPage){
      this.orderListRequest.pagenum=newPage
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped>

</style>
