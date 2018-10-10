<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-input v-model="listQuery.name" placeholder="请输入角色名称" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="search">搜索</el-button>
      </el-input>
      <el-button-group>
        <el-button type="primary" plain @click="roleFormInit(null)">新增</el-button>
        <el-button type="danger" plain @click="batchDelete">批量删除</el-button>
      </el-button-group>
    </el-row>
    <el-row class="row-bg">
      <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" width="55"/>
        <el-table-column label="ID" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="roleFormInit(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="角色" @closed="resetFrom">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="角色名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注" prop="description">
          <el-input v-model="form.description"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="默认注册角色">
          <el-radio v-model="form.defaultRole" :label="true">是</el-radio>
          <el-radio v-model="form.defaultRole" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="权限选择">
          <el-tree ref="tree" :data="permissions" :props="defaultProps" :expand-on-click-node="isOpen" show-checkbox node-key="id"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delRoleByIds, saveOrUpdateRole } from '@/api/role'
import { getAll, getAllByRole } from '@/api/permission'

export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      isOpen: false,
      defaultProps: {
        children: 'children',
        label: 'description'
      },
      form: {
        id: '',
        name: '',
        description: '',
        defaultRole: false,
        permissions: []
      },
      permissions: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      total: 0,
      listQuery: {
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    getAll().then(response => {
      this.permissions = response.data
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
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
      this.$refs.tree.setCheckedKeys([])
    },
    deleteRole(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleByIds([id]).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要删除的角色！'
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
          delRoleByIds(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    saveRole(str) {
      this.form.permissions = this.$refs.tree.getCheckedNodes()
      this.$refs[str].validate((valid) => {
        if (valid) {
          saveOrUpdateRole(this.form).then(response => {
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
    },
    roleFormInit(obj) {
      if (obj) {
        this.form.id = obj.id
        this.form.name = obj.name
        this.form.description = obj.description
        this.form.defaultRole = obj.defaultRole
        getAllByRole(obj.id).then(response => {
          if (response.data) {
            this.$refs.tree.setCheckedKeys(response.data)
          } else {
            this.$refs.tree.setCheckedKeys([])
          }
        })
      } else {
        this.form.id = ''
        this.form.name = ''
        this.form.description = ''
        this.form.defaultRole = false
      }
      this.form.permissions = []
      this.dialogFormVisible = true
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
