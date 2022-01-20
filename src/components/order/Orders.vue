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
          <el-input placeholder="输入查询内容" clearable v-model="orderListRequest.query"
                    @keypress.enter.native="getOrderList" @clear="getOrderList">
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
        <el-table-column label="下单时间" prop="create_time" :width="160">
          <template slot-scope="scope">
            {{ scope.row.create_time | simpleDateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time" :width="160">
          <template slot-scope="scope">
            {{ scope.row.update_time | simpleDateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="270">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" icon="el-icon-more" @click="onShowDetailsBtnClick(scope.row)">详情
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="onEditBtnClick">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDeleteBtnClick">删除</el-button>
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

    <!--修改地址弹窗-->
    <el-dialog title="修改地址" :visible.sync="editAddressDialogVisible">
      <el-form ref="editAddressDialogFormRef"
               :model="editAddressDialogForm"
               :rules="editaddressDialogRules"
               label-width="100px"
               @close="resetAddressEditForm">
        <el-form-item label="省市/区" prop="province">
          <el-cascader :options="citydata"
                       :props="addressProps"
                       v-model="editAddressDialogForm.province"
                       clearable filterable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="details">
          <el-input v-model="editAddressDialogForm.details"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="saveAddress">确定</el-button>
         <el-button @click="editAddressDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!--抽屉对话框-->
    <el-drawer
      title="订单详情"
      :visible.sync="orderDetailsDrawerVisible"
      :direction="'rtl'" size="25%">
      <el-descriptions :column="1">
        <el-descriptions-item class="descriptions" label="订单ID">{{ showDetailsOrder.order_id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ showDetailsOrder.user_id }}</el-descriptions-item>
        <el-descriptions-item label="订单数量">{{ showDetailsOrder.order_number }}</el-descriptions-item>
        <el-descriptions-item label="订单价格(元)">{{ showDetailsOrder.order_price }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          <template>
            <el-tag type="danger" v-if="showDetailsOrder.order_pay==='0'">未支付</el-tag>
            <el-tag type="primary" v-if="showDetailsOrder.order_pay==='1'">支付宝</el-tag>
            <el-tag type="success" v-if="showDetailsOrder.order_pay==='2'">微信</el-tag>
            <el-tag type="warning" v-if="showDetailsOrder.order_pay==='3'">银行卡</el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="是否发货">
          <template>
            <el-tag v-if="showDetailsOrder.is_send==='是'" type="success">是</el-tag>
            <el-tag v-if="showDetailsOrder.is_send==='否'" type="danger">否</el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="交易编号">{{ showDetailsOrder.trade_no }}</el-descriptions-item>
        <el-descriptions-item label="发票抬头">{{ showDetailsOrder.order_fapiao_title }}</el-descriptions-item>
        <el-descriptions-item v-if="showDetailsOrder.order_fapiao_title === '公司'" label="公司名称">
          {{ showDetailsOrder.order_fapiao_company }}
        </el-descriptions-item>
        <el-descriptions-item label="发票内容">{{ showDetailsOrder.order_fapiao_content }}</el-descriptions-item>
        <el-descriptions-item label="物流信息">
          <el-button size="mini" type="primary" @click="orderDetailsInnerDrawerVisible = true">查看物流信息</el-button>
          <el-drawer
            title="物流信息"
            :append-to-body="true"
            :visible.sync="orderDetailsInnerDrawerVisible" size="25%">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in express_info"
                :key="index"
                :timestamp="activity.time">
                {{ activity.context }}
              </el-timeline-item>
            </el-timeline>
          </el-drawer>
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ showDetailsOrder.create_time | simpleDateFormat }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ showDetailsOrder.update_time | simpleDateFormat }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
import citydata from '../../assets/js/citydata'

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
      orderList: [],  //订单列表
      editAddressDialogVisible: false,
      editAddressDialogForm: {
        province: [],
        details: ''
      },
      editaddressDialogRules: {
        province: [
          {
            required: true,
            message: '请选择省市/区',
            trigger: 'blur'
          }
        ],
        details: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      citydata,
      addressProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      orderDetailsDrawerVisible: false,
      orderDetailsInnerDrawerVisible: false,
      showDetailsOrder: {},
      express_info: []   //物流信息
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
    onPageSizeChange (newPageSize) {
      this.orderListRequest.pagesize = newPageSize
      this.getOrderList()
    },
    //翻页处理
    onCurrentPageChange (newPage) {
      this.orderListRequest.pagenum = newPage
      this.getOrderList()
    },
    //展示商品以及物流详情
    onShowDetailsBtnClick (order) {
      this.orderDetailsDrawerVisible = true
      this.showDetailsOrder = order
      this.getExpressInfo()
    },
    //编辑按钮，只允许编辑商品的省市区，以及详细地址
    onEditBtnClick () {
      this.editAddressDialogVisible = true
    },
    //删除按钮
    onDeleteBtnClick () {

    },
    //保存物流地址
    saveAddress () {
      this.$refs.editAddressDialogFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$message.success('保存物流地址成功')
        this.editAddressDialogVisible = false
      })
    },
    resetAddressEditForm () {
      this.$refs.editAddressDialogFormRef.resetFields()
    },
    getExpressInfo () {

    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}

.el-descriptions {
  margin-left: 20px !important;
}

.descriptions {
  color: darkgray;
}
</style>
