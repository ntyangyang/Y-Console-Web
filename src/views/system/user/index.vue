<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-input v-model="listQuery.username" placeholder="请输入用户名" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="search">搜索</el-button>
      </el-input>
      <el-button-group>
        <el-button type="primary" plain @click="dialogFormInit(null, true)">新增</el-button>
        <el-button type="danger" plain @click="batchDelUser">批量删除</el-button>
      </el-button-group>
    </el-row>
    <el-row class="row-bg">
      <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" width="55"/>
        <el-table-column label="ID" width="160px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex == 0" type="primary">男</el-tag>
            <el-tag v-if="scope.row.sex == 1" type="warning">女</el-tag>
            <el-tag v-if="scope.row.sex == 2" type="info">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status == 1" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="dialogFormInit(scope.row, false)"/>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="delUser(scope.row.id)"/>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="listQuery.pageNum"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </el-row>

    <!-- 新增 Form -->
    <el-dialog :visible.sync="dialogFormVisible" title="用户数据" @closed="resetFrom">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="用户名称" prop="username">
          <el-input v-model="form.username" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="form.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码" prop="repassword">
          <el-input v-model="form.repassword" type="password" auto-complete="off"/>
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
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-radio v-model="form.status" :label="0">正常</el-radio>
          <el-radio v-model="form.status" :label="1">禁用</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色">
          <el-checkbox-group v-model="form.roleIds">
            <el-checkbox v-for="role in allRoles" :label="role.id" :key="role.id">{{ role.description }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, delUserByIds, getRoleList, getUserRoles, saveOrUpdateUser, validateUsername } from '@/api/user'

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

    var validatePass = (rule, value, callback) => {
      if (this.flag && value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.repassword !== '') {
          this.$refs.form.validateField('repassword')
        }
        callback()
      }
    }

    var validatePass2 = (rule, value, callback) => {
      if (this.flag && value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    var validateTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
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
      listLoading: true,
      dialogFormVisible: false,
      flag: true,
      form: {
        id: '',
        username: '',
        password: '',
        repassword: '',
        mobile: '',
        email: '',
        address: '',
        sex: 0,
        status: 0,
        roleIds: []
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 15 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateTel, trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      allRoles: [],
      formLabelWidth: '100px',
      total: 0,
      listQuery: {
        username: '',
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getRoleList() {
      getRoleList().then(response => {
        this.allRoles = response.data
      })
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFrom() {
      this.$refs.form.clearValidate()
    },
    dialogFormInit(user, flag) {
      this.flag = flag
      if (user) {
        this.form.id = user.id
        this.form.username = user.username
        this.form.mobile = user.mobile
        this.form.email = user.email
        this.form.address = user.address
        this.form.sex = user.sex
        this.form.status = user.status
        getUserRoles(user.id).then(response => {
          this.form.roleIds = []
          for (var i = response.data.length - 1; i >= 0; i--) {
            this.form.roleIds.push(response.data[i].id)
          }
        })
      } else {
        this.form.id = ''
        this.form.username = ''
        this.form.mobile = ''
        this.form.email = ''
        this.form.address = ''
        this.form.sex = 0
        this.form.status = 0
        this.form.roleIds = []
      }
      this.form.password = ''
      this.form.repassword = ''
      this.dialogFormVisible = true
    },
    delUser(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserByIds([id]).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        })
      })
    },
    batchDelUser() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要删除的用户！'
        })
      } else {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (var i = this.multipleSelection.length - 1; i >= 0; i--) {
            ids.push(this.multipleSelection[i].id)
          }
          delUserByIds(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          })
        })
      }
    },
    saveUser(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          saveOrUpdateUser(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getList()
          })
          this.dialogFormVisible = false
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
