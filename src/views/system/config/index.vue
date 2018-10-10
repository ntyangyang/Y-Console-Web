<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-input v-model="listQuery.paramKey" placeholder="请输入参数名" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="search">搜索</el-button>
      </el-input>
      <el-button-group>
        <el-button type="primary" plain @click="paramFormInit(null)">新增</el-button>
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
        <el-table-column label="参数名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.paramKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参数值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.paramValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="paramFormInit(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="deleteParam(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="系统参数" @closed="resetFrom">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="参数名" prop="paramKey">
          <el-input v-model="form.paramKey"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="参数值">
          <el-input v-model="form.paramValue"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注">
          <el-input v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParam('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delParamByIds, saveOrUpdateParam } from '@/api/config'

export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      isOpen: false,
      form: {
        id: '',
        paramKey: '',
        paramValue: '',
        remark: ''
      },
      rules: {
        paramKey: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      total: 0,
      listQuery: {
        paramKey: '',
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
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
    },
    deleteParam(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delParamByIds([id]).then(response => {
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
          message: '请勾选要删除的参数！'
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
          delParamByIds(ids).then(response => {
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
    saveParam(str) {
      this.$refs[str].validate((valid) => {
        if (valid) {
          saveOrUpdateParam(this.form).then(response => {
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
    paramFormInit(obj) {
      if (obj) {
        this.form.id = obj.id
        this.form.paramKey = obj.paramKey
        this.form.paramValue = obj.paramValue
        this.form.remark = obj.remark
      } else {
        this.form.id = ''
        this.form.paramKey = ''
        this.form.paramValue = ''
        this.form.remark = ''
      }
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
