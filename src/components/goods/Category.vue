<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/categories">商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--主图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCategoryAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--使用第三方树形表格组件渲染分类的树形层级数据
         API: https://github.com/MisterTaki/vue-table-with-tree-grid
      -->
      <zk-table :data="categories"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :tree-type="true"
                stripe border>
        <!--使用template自定义表格列-->
        <template slot="category-status-template" slot-scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
          <i v-else-if="scope.row.cat_deleted===true" class="el-icon-error"></i>
        </template>
        <template slot="category-level-tag-template" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" type="primary">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="warning">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===2" type="success">三级</el-tag>
        </template>
        <template slot="category-operation-template" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showCategoryEditDialog(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"
                     @click="deleteUserCategoryId(scope.row.id)">删除
          </el-button>
        </template>
      </zk-table>
      <!--分页-->
      <el-pagination @size-change="pageSizeChangeRefresh"
                     @current-change="currentPageChangeRefresh"
                     :current-page="queryCategoriesRequest.pagenum"
                     :page-sizes="[5, 10, 50, 100]"
                     :page-size="queryCategoriesRequest.pagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                     :total="categoriesTotal">
      </el-pagination>
    </el-card>

    <!--添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="categoryAddDialogVisible" width="50%" @close="resetCategoryAddDialog">
      <el-form ref="categoryAddFormRef" :model="categoryAddForm" :rules="categoryAddRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryAddForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分类">
          <!--
          :option 用来指定数据源
          :props 用来指定级联规则配置对象
          -->
          <el-cascader
            :change-on-select="true"
            v-model="addCategorySelectedKeys"
            :options="parentCategories"
            :props="categoryProps"
            @change="addCategorySelectedRefresh"
            clearable :style="'width:100%'"></el-cascader>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="saveAddCategory">确定</el-button>
         <el-button @click="categoryAddDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'GoodsCategory',
  data () {
    return {
      categories: [], //商品分类数据列表
      parentCategories: [], //父级商品分类数据列表
      queryCategoriesRequest: {  //分页查询参数
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categoriesTotal: 0,   //商品分类数据列表总大小
      categoryStatus: false,
      columns: [
        //为树形table定义列
        {
          label: 'ID',
          prop: 'cat_id',
        },
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_delete',
          type: 'template',
          template: 'category-status-template'
        },
        {
          label: '排序',
          type: 'template',   //将但前列定义为模板列
          template: 'category-level-tag-template'
        },
        {
          label: '操作',
          type: 'template',
          template: 'category-operation-template'
        }
      ],
      categoryAddDialogVisible: false,  //添加分类对话框显示隐藏控制
      categoryEditDialogVisible: false,  //修改分类对话框显示隐藏控制
      categoryAddForm: {   //添加分类的表单数据
        cat_pid: 0,    //分类的父级分类id
        cat_name: '',  //将要添加的分类名称
        cat_level: 0   //将要添加的分类级别，默认是1级
      },
      categoryEditForm: {},
      categoryAddRules: {
        cat_name: [
          {
            required: true,
            message: '分类名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      //级联选择配置对象
      categoryProps: {
        value: 'cat_id',   //选中的值
        label: 'cat_name',   //展示的值
        children: 'children'   //父子嵌套
      },
      addCategorySelectedKeys: [] //级联选择器选中的分类级父分类id
    }
  },
  methods: {
    //获取分类数据
    getCategories () {
      this.$http.get('categories', { params: this.queryCategoriesRequest }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败！')
        }
        this.categories = resp.data.result
        console.log(this.categories)
        this.categoriesTotal = resp.data.total
      })
    },
    //获取父级分类列表
    getParentCategories () {
      this.$http.get('categories', {
        params: {
          type: 2
        }
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败')
        }
        this.parentCategories = resp.data
      })
    },
    pageSizeChangeRefresh (newSize) {
      //newSize 会在 vue调用此函数的时候自动传入
      this.queryCategoriesRequest.pagesize = newSize
      this.getCategories()
    },
    currentPageChangeRefresh (newPage) {
      //newPage 也会在 vue调用函数的时候自动传入
      this.queryCategoriesRequest.pagenum = newPage
      this.getCategories()
    },
    //展示添加商品分类对话框
    showCategoryAddDialog () {
      //首先获取父级分类数据
      this.getParentCategories()
      this.categoryAddDialogVisible = true
    },
    // 级联选择选中之后
    addCategorySelectedRefresh () {
      console.log(this.addCategorySelectedKeys)
      if (this.addCategorySelectedKeys.length > 0) {
        //选中了分类
        this.categoryAddForm.cat_pid = this.addCategorySelectedKeys[this.addCategorySelectedKeys.length - 1]
        this.categoryAddForm.cat_level = this.addCategorySelectedKeys.length
      } else {
        //重置父级分类和父级级别
        this.categoryAddForm.cat_pid = 0
        this.categoryAddForm.cat_level = 0
      }
    },
    //显示编辑弹窗
    showCategoryEditDialog () {
    },
    //保存编辑结果
    saveEditCategory () {
    },
    //添加分类
    saveAddCategory () {
      this.$refs.categoryAddFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.post('categories', this.categoryAddForm).then(response => {
          let resp = response.data
          if (resp.meta.status !== 201) {
            return this.$message.error('新增分类失败！')
          }
          //重新加载分类列表
          this.getCategories()
          this.categoryAddDialogVisible = false
          this.$message.success('新增分类成功！')
        })
      })
    },
    //删除商品分类
    deleteUserCategoryId (categoryId) {
    },
    resetCategoryAddDialog () {
      //清空表单
      this.$refs.categoryAddFormRef.resetFields()
      this.addCategorySelectedKeys = []
      this.categoryAddForm.cat_level = 0
      this.categoryAddForm.cat_pid = 0
    }
  },
  created () {
    this.getCategories()
  }
}
</script>

<style scoped>
.el-card {
  text-align: left
}

.zk-table {
  margin-top: 15px;
}

.el-icon-success {
  color: lightgreen !important;
}

.el-icon-error {
  color: red !important;
}
</style>
