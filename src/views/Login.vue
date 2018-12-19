<template>
  <div class="login_wrapper">
    <div class="login">
      <el-form :model="formLogin">
        <el-form-item>
          <h2 class="title">后台管理系统</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.loginName" placeholder="账号" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.password" placeholder="密码" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" :disabled="!formLogin.loginName || !formLogin.password">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="bei">华南理工大学团学管理系统</p>
    <p class="recover">点击恢复数据</p>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      formLogin: {
        password: "",
        loginName: ""
      }
    };
  },
  methods: {
    login() {
      let temp_data = {
        account: this.formLogin.loginName,
        pwd: this.formLogin.password
      }
      this.axios.post(`${host}/admin/login`, temp_data).then((res) => {
        if (res.data.state === 0) {
          this.$message({
            message: "登录成功",
            type: "success"
          })
          this.$router.push('/home')
        } else {
          this.$message({
            message: `错误码${res.data.state}`,
            type: "error"
          })
        }
      })
    }
  }
};
</script>


<style lang="scss">
$input_width: 300px;
.login_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login {
    width: 460px;
    height: 296px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      text-align: center;
      color: #505458;
    }
    .el-form-item__content {
      width: $input_width;
    }
    .el-button {
      width: $input_width;
    }
    .el-form {
      margin: 30px 80px auto 80px;
      .error {
        display: block;
        text-align: center;
        color: red;
      }
    }
  }
}
.recover {
  position: absolute;
  bottom: 0px;
  cursor: pointer;
  color: #e6a23c;
  display: none;
}
.bei {
  position: absolute;
  bottom: 20px;
  cursor: pointer;
  color: #505458;
}
</style>