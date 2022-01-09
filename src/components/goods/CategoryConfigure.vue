<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/params">参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--主体区域-->
    <el-card>
      <el-alert title="注意：只允许为第三方分类设置商品参数" show-icon type="warning" :closable="false"></el-alert>

      <el-row class="category-select">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader :options="categories"
                       :props="categoryProps"
                       v-model="selectedKeys"
                       @change="cascaderSelectedRefresh"
                       :style="'margin-left:10px'"></el-cascader>
        </el-col>
      </el-row>

      <el-tabs type="border-card" v-model="activeTabName" @tab-click="switchTab">
        <!--添加动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isAddParamsBtnDisabled" type="primary" size="mini" @click="showAddParamsDialog">添加参数
          </el-button>
          <!--动态参数表格-->
          <el-table :data="dynamicTableParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index" closable @close="deleteParamsValueById(index,scope.row)">
                  {{ item }}
                </el-tag>
                <el-input size="small" class="input-new-tag"
                          ref="inputParamRef"
                          v-model="scope.row.inputParamValue"
                          v-if="scope.row.inputParamValueVisible"
                          @keyup.enter.native="refreshParamValue(scope.row)"
                          @blur="refreshParamValue(scope.row)"></el-input>
                <el-button size="small" class="input-new-tag" v-else @click="showParamValueInput(scope.row)">+ 添加新特性
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="ID" prop="attr_id"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditParamsDialog(scope.row)">编辑
                </el-button>
                <el-button size="small" type="danger" icon="el-icon-delete"
                           @click="deleteParamsById(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态参数面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isAddParamsBtnDisabled" type="primary" size="mini" @click="showAddParamsDialog">添加属性
          </el-button>
          <!--静态参数表格-->
          <el-table :data="staticTableParams" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="ID" prop="attr_id"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditParamsDialog(scope.row)">编辑
                </el-button>
                <el-button size="small" type="danger" icon="el-icon-delete"
                           @click="deleteParamsById(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数弹窗-->
    <el-dialog :title="getAddDialogTitle" :visible.sync="addParamsDialogVisible" @close="resetAddDialog">
      <el-form ref="paramsAddFormRef" :model="paramsAddForm" :rules="paramsAddRules" label-width="100px">
        <el-form-item :label="getDialogPropText" prop="attr_name">
          <el-input v-model="paramsAddForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="saveAddParams">确定</el-button>
         <el-button @click="addParamsDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!--修改参数弹窗-->
    <el-dialog :title="getEditDialogTitle" :visible.sync="editParamsDialogVisible">
      <el-form ref="paramsEditFormRef" :model="paramsEditForm" :rules="paramsEditRules" label-width="100px">
        <el-form-item :label="getDialogPropText" prop="attr_name">
          <el-input v-model="paramsEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="saveEditParams">确定</el-button>
         <el-button @click="editParamsDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CategoryConfigure',
  data () {
    return {
      categories: [], //所有商品分类列表
      categoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],  //级联选择器选中项
      activeTabName: 'many',  //被激活的标签页
      dynamicTableParams: [],  //动态参数数据
      staticTableParams: [],    //静态参数数据
      addParamsDialogVisible: false,
      editParamsDialogVisible: false,
      paramsAddForm: {
        attr_name: ''
      },
      paramsEditForm: {
        attr_id: -1,
        attr_name: ''
      },
      paramsAddRules: {
        attr_name: [
          {
            required: true,
            message: '参数名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      paramsEditRules: {
        attr_name: [
          {
            required: true,
            message: '参数名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //获取分类数据
    getCategories () {
      this.$http.get('categories').then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败！')
        }
        this.categories = resp.data
      })
    },
    //级联选择器选中处理
    cascaderSelectedRefresh () {
      this.getCategoryParamsList()
    },
    //tab点击处理
    tabClickRefresh () {
      this.getCategoryParamsList()
    },
    //获取参数列表
    getCategoryParamsList () {
      if (this.selectedKeys.length !== 3) {
        //不是三级分类
        this.selectedKeys = []
        return
      }
      //选中的三级分类
      //根据所选分离id和所处面板获取对应参数
      this.$http.get(`categories/${this.getSelectedCategoryId}/attributes`, {
        params: {
          sel: this.activeTabName
        }
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品参数列表失败')
        }
        console.log(resp)
        resp.data.forEach(item => {
          //item.attr_vals不为空时再分割
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',').filter(function (val) {
            return val !== ''
          }) : []

          //控制文本框的显示与隐藏
          item.inputParamValueVisible = false
          item.inputParamValue = ''
        })
        if (this.activeTabName === 'many') {
          this.dynamicTableParams = resp.data
        } else {
          this.staticTableParams = resp.data
        }
      })
    },
    //点击tab标签时切换tab页
    switchTab () {
      this.tabClickRefresh()
    },
    //显示添加动态参数或静态属性弹窗
    showAddParamsDialog () {
      this.addParamsDialogVisible = true
    },
    showEditParamsDialog (param) {
      this.editParamsDialogVisible = true
      this.paramsEditForm.attr_name = param.attr_name
      this.paramsEditForm.attr_id = param.attr_id
    },
    showParamValueInput (param) {
      param.inputParamValueVisible = true
      //自动获得焦点
      // $nextTick 方法会在当页面上元素被重新渲染后会执行回调方法
      this.$nextTick(__ => {
        //this.$refs.inputParamRef.$refs.input 可以获取到文本框的DOM对象
        this.$refs.inputParamRef.$refs.input.focus()
      })
    },
    //添加分类参数
    saveAddParams () {
      this.$refs.paramsAddFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.post(`categories/${this.getSelectedCategoryId}/attributes`, {
          attr_name: this.paramsAddForm.attr_name,
          attr_sel: this.activeTabName
        }).then(response => {
          let resp = response.data
          console.log(resp)
          if (resp.meta.status !== 201) {
            return this.$message.error('添加参数失败！')
          }
          this.$message.success('添加参数成功！')
          this.addParamsDialogVisible = false
          if (this.activeTabName === 'many') {
            this.dynamicTableParams.push(resp.data)
          } else {
            this.staticTableParams.push(resp.data)
          }
        })
      })
    },
    //保存参数修改
    saveEditParams () {
      this.$refs.paramsEditFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.put(`categories/${this.getSelectedCategoryId}/attributes/${this.paramsEditForm.attr_id}`, {
          attr_name: this.paramsEditForm.attr_name,
          attr_sel: this.activeTabName
        }).then(response => {
          let resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('保存修改失败！')
          }
          this.$message.success('保存修改成功！')
          this.editParamsDialogVisible = false
          this.getCategoryParamsList()
        })
      })
    },
    //删除分类参数
    deleteParamsById (attr_id) {
      this.$confirm('此操作将永久删除此参数，是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //确认点击后
        this.$http.delete(`categories/${this.getSelectedCategoryId}/attributes/${attr_id}`).then(response => {
          let resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('删除参数发生错误!')
          }
          this.$message.success('删除参数成功！')
          this.getCategoryParamsList()
        })
      }).catch(() => {
        //取消点击后
        this.$message.info('取消了删除操作')
      })
    },
    //在文本输入框失去焦点或者按下enter键之后会调用
    refreshParamValue (param) {
      param.inputParamValueVisible = false
      if (param.inputParamValue.trim().length === 0) {
        param.inputParamValue = ''
        return
      }
      //后续处理
      param.attr_vals.push(param.inputParamValue.trim())
      param.inputParamValue = ''
      this.saveParamValue(param)
    },
    //保存参数项value
    saveParamValue (param) {
      this.$http.put(`categories/${this.getSelectedCategoryId}/attributes/${param.attr_id}`, {
        attr_name: param.attr_name,
        attr_sel: this.activeTabName,
        attr_vals: param.attr_vals.join(',')
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('修改参数项失败!')
        }
        this.$message.success('修改参数项成功!')
      })
    },
    //删除对应参数可选项
    deleteParamsValueById (index, param) {
      param.attr_vals.splice(index, 1)
      param.attr_vals.filter(function (val) {
        return val !== ''
      })
      this.saveParamValue(param)
    },
    resetAddDialog () {
      //重置表单
      this.$refs.paramsAddFormRef.resetFields()
    }
  },
  computed: {
    //计算添加属性按钮是否需要禁用，是返回true,否则返回false
    isAddParamsBtnDisabled () {
      return this.selectedKeys.length !== 3
    },
    //从级联选中数组中获取三级分类id
    getSelectedCategoryId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    getAddDialogTitle () {
      return '添加' + this.getDialogPropText
    },
    getEditDialogTitle () {
      return '修改' + this.getDialogPropText
    },
    getDialogPropText () {
      return this.activeTabName === 'many' ? '动态参数' : '静态属性'
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

.el-table__expanded-cell,
.el-tag--light {
  margin: 10px;
}

.input-new-tag {
  margin: 10px;
  width: 100px;
}

.category-select {
  margin: 15px 0 15px 0;
}
</style>
