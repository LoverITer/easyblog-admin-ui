<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png">
      </div>
      <!--登录表单-->
      <el-form ref="loginRef" v-bind:model="loginForm" :rules="loginFormRules" class="login-form">
        <!---用户名-->
        <el-form-item prop="=username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button plain type="primary" @click="login">登录</el-button>
          <el-button plain type="info" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单校验
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度在6~16位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm: function () {
      this.$refs.loginRef.resetFields()
    },
    login: function () {
      // valid接受一个回调函数 表示校验结果
      this.$refs.loginRef.validate(valid => {
        // 表单预验证
        if (valid) {
          // 如果验证通过,向服务器发送请求
          console.log('表单验证通过,发起请求进行登录')
          this.$http.post('login', this.loginForm).then(response => {
            if (response.data.meta.status !== 200) {
              return this.$message.error('用户名或密码不匹配')
            }
            this.$message.success('登录成功')
            // 登录成功后将服务器返回的token 使用 sessionStorage 保存到用户本地
            window.sessionStorage.setItem('LOGIN_TOKEN', response.data.data.token)
            // 通过编程式导航跳转到后台主页，路由地址是 /home
            this.$router.push('/home')
          })
        }
      })
    },
    register: function () {
      //点击注册跳转到注册页面
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
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

.btns {
  display: flex;
  justify-content: flex-end;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
