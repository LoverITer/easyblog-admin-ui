<template>
  <div class="register-container">
    <div class="register-box">
      <div class="avatar-box">
        <img src="../assets/logo.png">
      </div>

      <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
        <el-form-item>
          <el-input placeholder="请输入用户名" v-model="registerForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入密码" v-model="registerForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请确认密码" v-model="registerForm.repassword" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain>立即注册</el-button>
        </el-form-item>

        <div class="link">
          <router-link class="login-link" to="/login">已有账号？立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      'registerForm': {
        username: '',
        password: '',
        repassword: ''
      },
      'registerRules': {
        username: [
          {}
        ],
        password: [
          {}
        ],
        repassword: [
          {}
        ]
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.register-container {
  background-color: #2b4b6b;
  height: 100%;
}

.register-box {
  width: 450px;
  height: 390px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -40%);
  background-color: #fff;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.register-form{
  position: absolute;
  bottom: 15px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login-link{
  color: #409EFF;
  text-decoration: none;
}

.login-link :hover{
  border-bottom: #409EFF 1px solid;
}
</style>
