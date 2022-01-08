<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--主体视图-->
    <el-card class="role-list-container">
      <el-button type="primary" @click="addDialogVisible=!addDialogVisible">添加角色</el-button>
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['auth-tag-bottom','vcenter',index===0?'auth-tag-top':'']"
                    v-for="(item,index) in scope.row.children" :key="item.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag class="auth-name-tag" closable @close="deleteRightById(scope.row,item)">{{
                    item.authName
                  }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <el-row :class="['vcenter',index2===0?'':'auth-tag-top']" v-for="(item2,index2) in item.children"
                        :key="item2.id">
                  <!--二级权限-->
                  <el-col :span="6">
                    <el-tag type="success" class="auth-name-tag" closable @close="deleteRightById(scope.row,item2)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限-->
                  <el-col :span="18">
                    <el-tag class="auth-name-tag" type="warning" v-for="(item3,index3) in item2.children"
                            :key="item3.id" closable @close="deleteRightById(scope.row,item3)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色权限" prop="path"></el-table-column>
        <el-table-column label="操作" width="285px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditRoleDialog(scope.row)">编辑
            </el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteRoleById(scope.row.id)">删除
            </el-button>
            <el-button size="mini" icon="el-icon-setting" type="warning" @click="showConfigRoleDialog(scope.row)">配置角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="initDialog">
      <!--对话框内容主体-->
      <el-form ref="roleAddFormRef" :model="addRoleForm" :rules="addRoleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="addRole">确定</el-button>
         <el-button @click="addDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!--修改角色信息-->
    <el-dialog title="添加角色" :visible.sync="editDialogVisible">
      <!--对话框内容主体-->
      <el-form ref="roleEditFormRef" :model="editRoleForm" :rules="editRoleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="editRole">确定</el-button>
         <el-button @click="editDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="configRightsDialogVisible">
      <!--树形控件:
        :data 绑定数据源
        :default-checked-keys: 默认选中的节点的key
        :props: 绑定属性映射
        node-key: 给每个节点指定唯一主键，这里指定的是数据id
        default-expand-all 是否展开所有节点，默认false
      -->
      <el-tree :data="rightsList"
               :default-checked-keys="checkedRightsList"
               :props="rightsTreeProps"
               node-key="id"
               show-checkbox
               ref="rightsTreeRef"
               default-expand-all>
      </el-tree>
      <!--对话框底部按钮-->
      <span slot="footer" class="dialog-foot">
        <el-button type="primary" @click="configRole">确定</el-button>
         <el-button @click="configRightsDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      role: {},  //当前角色对象
      roleList: [], //角色列表
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          // 角色名称校验规则
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          //角色描述校验规则
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
          }
        ]
      },
      editRoleFormRules: {
        roleName: [
          // 角色名称校验规则
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          //角色描述校验规则
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
          }
        ]
      },
      addDialogVisible: false, //添加角色弹窗显示隐藏控制
      editDialogVisible: false, //修改角色弹窗显示隐藏控制
      configRightsDialogVisible: false,  //分配权限弹窗显示隐藏控制
      rightsList: [],     //权限数据列表
      rightsTreeProps: {
        //树形控件树形绑定对象
        label: 'authName',
        children: 'children'
      },
      checkedRightsList: []   //权限数据默认被选中的数据列表
    }
  },
  methods: {
    //获取角色列表
    getRoleList () {
      this.$http.get('roles').then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取角色数据失败')
        }
        this.roleList = resp.data
      })
    },
    //添加角色
    addRole () {
      this.$refs.roleAddFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.post('roles', this.addRoleForm).then(response => {
          let resp = response.data
          if (resp.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.addDialogVisible = false
          this.getRoleList()
          this.$message.success('添加角色成功')
        })
      })
    },
    //
    showEditRoleDialog (user) {
      this.editRoleForm = user
      this.editDialogVisible = true
    },
    //编辑角色
    editRole () {
      this.$refs.roleEditFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查输入')
        }
        this.$http.put(`roles/${this.editRoleForm.id}`, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        }).then(response => {
          let resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          }
          this.editDialogVisible = false
          this.getRoleList()
          this.$message.success('修改角色信息成功')
        })
      })
    },
    //删除角色
    deleteRoleById (roleId) {
      this.$confirm('此操作将永久删除此角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //确认了操作
        this.$http.delete(`roles/${roleId}`).then(response => {
          let resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.getRoleList()
          this.$message.success('删除角色成功')
        })
      }).catch(err => {
        this.$message.info('已取消删除')
      })
    },
    //删除角色权限
    deleteRightById (role, right) {
      this.$confirm('此操作将永久删除' + role.roleName + '的' + right.authName + '权限,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonTest: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${right.id}`).then(response => {
          let resp = response.data
          if (resp.meta.status !== 200) {
            return this.$message.error('删除' + role.roleName + '的' + right.authName + '失败')
          }
          //给角色权限重新赋值
          role.children = resp.data
          this.$message.success('删除' + role.roleName + '的' + right.authName + '成功')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    //展示配置权限弹窗
    showConfigRoleDialog (node) {
      this.role = node
      this.$http.get('rights/tree').then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        //把获取的数据交给vue去渲染属性列表
        this.rightsList = resp.data
        //获取角色的三级角色数据
        let checkedRightsList = []
        this.getLeafKeys(node, checkedRightsList)
        // 重新赋值，防止上一次的数据影响下一次
        this.checkedRightsList = []
        this.checkedRightsList = checkedRightsList
        //展示对话框
        this.configRightsDialogVisible = true
      })
    },
    //递归获取三级节点的id
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //配置角色
    configRole () {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      this.$http.post(`roles/${this.role.id}/rights`, {
        rids: keyStr
      }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        //更新成功之后重新渲染列表
        this.getRoleList()
        //关闭弹窗
        this.configRightsDialogVisible = false
      })
    },
    //初始化弹窗
    initDialog () {
      this.$refs.roleAddFormRef.resetFields()
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style scoped>
.el-card {
  text-align: left
}

.auth-name-tag {
  margin: 7px;
}

.auth-tag-top {
  border-top: 1px solid #eee;
}

.auth-tag-bottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
