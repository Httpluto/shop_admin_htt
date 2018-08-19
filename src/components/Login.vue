<template>
  <div class="login">
    <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 用户名的校验
        username: [
          // 用户名是必须
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        // 密码的校验
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: 'login',
            data: this.form
          }).then(res => {
            const {meta, data} = res.data
            if (meta.status === 200) {
              this.$message.success('恭喜你,登录成功')
              localStorage.setItem('myToken', data.token)
              this.$router.push('home')
            } else {
              this.$message.error('用户名或者密码错误')
            }
          })
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      width: 100px;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button ~ .el-button {
      margin-left: 80px;
    }
  }
}
</style>
