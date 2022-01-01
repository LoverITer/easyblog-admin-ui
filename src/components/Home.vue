<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <span>Vue 电商后台管理系统</span>
      </div>
      <el-button plain type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
              <!--二级菜单模板-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
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
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      menuIcon: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      }
    }
  },
  methods: {
    logout: function () {
      // 清空sessionStorage
      window.sessionStorage.clear()
      // 重定向到登录页
      this.$router.push('/login')
    },
    /**
     * 获取菜单列表
     */
    getMenuList: function () {
      this.$http.get('menus').then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error(resp.meta.msg)
        }
        this.menuList = resp.data
      })
    }
  },
  created: function () {
    this.getMenuList()
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-header img {
  width: 50px;
  height: 50px;
}

.el-header div {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.el-header div span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-menu-item {
  padding-left: 80px !important;
}

.iconfont{
  margin-right: 5px;
}
</style>
