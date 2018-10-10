<template>
  <div class="app-container">
    <!-- acount Form -->
    <el-col :span="10">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="用户名称" prop="username">
          <el-input v-model="form.username" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="地址">
          <el-input v-model="form.address" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="性别">
          <el-radio v-model="form.sex" :label="0">男</el-radio>
          <el-radio v-model="form.sex" :label="1">女</el-radio>
          <el-radio v-model="form.sex" :label="2">隐藏</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="resetForm('form')">重 置</el-button>
          <el-button type="primary" @click="saveUser('form')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { acountUpdate, validateUsername } from '@/api/user'
import { getInfo } from '@/api/login'

export default {
  data() {
    var validateName = (rule, value, callback) => {
      validateUsername(value, this.form.id).then(response => {
        if (response.data) {
          callback()
        } else {
          callback(new Error('用户名已存在!'))
        }
      })
    }

    var validateTel = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      form: {
        id: '',
        username: '',
        mobile: '',
        email: '',
        address: '',
        sex: 0
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 15 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateTel, trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getInfo().then(response => {
        this.form = response.data
      })
    },
    resetForm(str) {
      this.$refs[str].clearValidate()
      this.getInfo()
    },
    saveUser(str) {
      this.$refs[str].validate((valid) => {
        if (valid) {
          acountUpdate(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getInfo()
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
