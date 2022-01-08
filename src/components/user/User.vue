<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/users">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索添加区域-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="查询" v-model="userInfoQueryParam.query" @clear="getUserList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=!addDialogVisible">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表数据区-->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!--
            作用域插槽：slot-scope 可以获取到本行的数据
          -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="saveUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <!--删除按钮-->
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteUserById(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip :enterable="false" effect="dark" placement="top" content="分配角色">
              <el-button size="mini" type="warning" icon="el-icon-setting"
                         @click="showEditRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @size-change="pageSizeChangeRefresh"
                     @current-change="currentPageChangeRefresh"
                     :current-page="userInfoQueryParam.pagenum"
                     :page-sizes="[1, 2, 3, 5]"
                     :page-size="userInfoQueryParam.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="initDialog">
      <!--对话框内容主体-->
      <el-form ref="userAddFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="addUser">确定</el-button>
         <el-button @click="addDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!--修改用户对话框-->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible">
      <!--对话框内容主体-->
      <el-form ref="userEditFormRef" :model="editUserForm" :rules="editUserFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="editUser">确定</el-button>
         <el-button @click="editDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!--分配角色弹窗-->
    <el-dialog title="修改角色信息" :visible.sync="editRoleDialogVisible">
      <el-form ref="userRoleEditFormRef" :model="editRoleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editRoleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role_name">
          <el-input v-model="editRoleForm.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select :disabled="editRoleForm.username==='admin'" class="role-select"
                     v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="editRole">确定</el-button>
         <el-button @click="editRoleDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    //校验邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //校验通过
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //校验手机号
    var checkMobile = (rule, value, callback) => {
      const mobileEmail = /^1[34578]\d{9}$/
      if (mobileEmail.test(value)) {
        //校验通过
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      //  用户列表请求参数
      userInfoQueryParam: {
        query: '',
        pagenum: 1,   //用户列表当前分页
        pagesize: 5  //分页大小
      },
      userList: [],   //用户列表数据
      roleList: [],    //用户角色数据
      total: 0,          //用户列表总大小
      addDialogVisible: false,   //对话框是否显示，默认不显示
      editDialogVisible: false,
      editRoleDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editRoleForm: {
        id: '',
        username: '',
        role_name: ''
      },
      addUserFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3~10之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editUserFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      selectedRoleId: ''
    }
  },
  methods: {
    //查询用户列表数据
    getUserList () {
      this.$http.get('users', {
        params: this.userInfoQueryParam
      }).then(response => {
        const resp = response.data
        console.log(resp)
        if (resp.meta.status !== 200) {
          return this.$message.error('获取用户数据失败')
        }
        this.userList = resp.data.users
        this.total = resp.data.total
      })
    },
    //处理选择分页大小动作
    pageSizeChangeRefresh (newSize) {
      //给pagesize赋值
      this.userInfoQueryParam.pagesize = newSize
      //再次请求数据
      this.getUserList()
    },
    //处理翻页动作
    currentPageChangeRefresh (newPage) {
      this.userInfoQueryParam.pagenum = newPage
      this.getUserList()
    },
    //保存用户状态的改变
    saveUserStatus (user) {
      this.$http.put(`users/${user.id}/state/${user.mg_state}`).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          user.mg_state = !user.mg_state
          return this.$message.error('保存用户状态失败')
        }
        this.$message.success('更新状态成功')
      })
    },
    //处理对话框关闭时初始化对话框
    initDialog () {
      this.$refs.userAddFormRef.resetFields()
    },
    //添加用户
    addUser () {
      this.$refs.userAddFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.post('users', this.addUserForm).then(response => {
          const resp = response.data
          if (resp.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          //隐藏添加对话框
          this.addDialogVisible = !this.addDialogVisible
          //重载数据
          this.getUserList()
        })
      })
    },
    //修改用户对话框
    showEditDialog (user) {
      this.editUserForm = user
      this.editDialogVisible = true
    },
    //提交用户修改信息,参数是原本的信息
    editUser () {
      this.$refs.userEditFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        }).then(response => {
          const resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('更新用户信息失败')
          }
          //更新成功之后：1.关闭对话框；2.属性数据列表；3. 显示更新成功消息
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功')
        })
      })
    },
    deleteUserById (userId) {
      // this.$confirm 进行确认操作
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${userId}`).then(response => {
          const resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.getUserList()
          return this.$message.success('删除成功')
        })
      }).catch(() => {
        //捕捉messageBox点击取消后的异常，可以再此进行取消后的操作
        this.$message.info('已取消删除')
      })
    },
    //显示修角色对话框
    showEditRoleDialog (user) {
      //显示用户角色编辑窗口
      this.editRoleForm = user
      this.selectedRoleId = user.role_name
      this.$http.get('roles').then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取用户角色数据失败')
        }
        this.roleList = resp.data
        this.editRoleDialogVisible = true
      })
    },
    //编辑角色
    editRole () {
      if (this.selectedRoleId === this.editRoleForm.role_name) {
        return this.$message.error('请选择角色')
      }
      this.$http.put(`users/${this.editRoleForm.id}/role`, {
        rid: this.selectedRoleId
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('保存用户角色失败')
        }
        this.getUserList()
        this.editRoleDialogVisible = false
        this.$message.success('保存用户角色成功')
        this.resetEditRoleDialog()
      })
    },
    resetEditRoleDialog () {
      this.selectedRoleId = ''
      this.editRoleForm = ''
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style scoped>
.role-select {
  width: 100% !important;
}
</style>
