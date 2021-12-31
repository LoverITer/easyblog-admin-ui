<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.login-container{
  background-color: #2b4b6b;
  height: 100%;
}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}

.avatar-box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-40%);
  background-color: #fff;
}
.avatar-box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
