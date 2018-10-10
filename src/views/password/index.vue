<template>
  <div class="app-container">
    <!-- password Form -->
    <el-col :span="10">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="原密码" prop="password">
          <el-input v-model="form.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认新密码" prop="reNewPassword">
          <el-input v-model="form.reNewPassword" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="resetForm('form')">重 置</el-button>
          <el-button type="primary" @click="savePassword('form')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { passwordUpdate } from '@/api/user'

export default {
  data() {
    var validateNewPassword = (rule, value, callback) => {
      if (this.flag && value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.form.reNewPassword !== '') {
          this.$refs.form.validateField('reNewPassword')
        }
        callback()
      }
    }

    var validateReNewPassword = (rule, value, callback) => {
      if (this.flag && value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入的新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        newPassword: '',
        reNewPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        reNewPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateReNewPassword, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px'
    }
  },
  methods: {
    resetForm(str) {
      this.$refs[str].clearValidate()
      this.form.password = ''
      this.form.newPassword = ''
      this.form.reNewPassword = ''
    },
    savePassword(str) {
      this.$refs[str].validate((valid) => {
        if (valid) {
          passwordUpdate(this.form).then(response => {
            if (response.code === 4100) {
              this.$message({
                type: 'error',
                message: '原密码错误'
              })
            } else {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
  .input-with-search {
    width: 250px;
  }
  .input-with-search .el-input-group__prepend {
    background-color: #fff;
  }
  .row-bg {
    padding: 10px 0;
  }
</style>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
