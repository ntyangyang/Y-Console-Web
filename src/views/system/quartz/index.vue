<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-input v-model="listQuery.beanName" placeholder="请输入bean名称" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="search">搜索</el-button>
      </el-input>
      <el-button-group>
        <el-button type="primary" plain @click="jobFormInit(null)">新增</el-button>
        <el-button type="danger" plain @click="batchDelete">批量删除</el-button>
        <el-button type="info" plain @click="batchPause">批量暂停</el-button>
        <el-button type="success" plain @click="batchResume">批量恢复</el-button>
        <el-button type="success" plain @click="batchRun">批量执行</el-button>
      </el-button-group>
      <el-button type="primary" round @click="jobLog">日志列表</el-button>
    </el-row>
    <el-row class="row-bg">
      <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" width="55"/>
        <el-table-column label="ID" width="160px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="bean名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.beanName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方法名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.methodName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务参数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.params }}</span>
          </template>
        </el-table-column>
        <el-table-column label="cron表达式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cronExpression }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status == 1" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="jobFormInit(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="deleteJob(scope.row.id)">删除</el-button>
              <el-button type="info" size="small" @click="pauseJob(scope.row.id)">暂停</el-button>
              <el-button type="success" size="small" @click="resumeJob(scope.row.id)">恢复</el-button>
              <el-button type="success" size="small" @click="runJob(scope.row.id)">执行</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="定时任务" @closed="resetFrom">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="bean名称" prop="beanName">
          <el-input v-model="form.beanName"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="方法名称" prop="methodName">
          <el-input v-model="form.methodName"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="方法参数">
          <el-input v-model="form.params"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注">
          <el-input v-model="form.remark"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-radio v-model="form.status" :label="0">正常</el-radio>
          <el-radio v-model="form.status" :label="1">暂停</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveJob('form')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 日志列表 -->
    <el-dialog :visible.sync="dialogLogVisible" width="80%" title="日志列表">
      <el-input v-model="logsQuery.jobId" placeholder="请输入任务ID" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="logSearch">搜索</el-button>
      </el-input>
      <el-table v-loading.body="logsLoading" :data="logList" tooltip-effect="dark" fit highlight-current-row style="width: 100%">
        <el-table-column label="ID" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务ID" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.jobId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="bean名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.beanName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方法名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.methodName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务参数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.params }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="success">成功</el-tag>
            <el-tag v-if="scope.row.status == 1" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时(单位:毫秒)" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.times }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="logsQuery.pageNum"
          :page-sizes="[10,20,30, 50]"
          :page-size="logsQuery.pageSize"
          :total="logsTotal"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleLogSizeChange"
          @current-change="handleLogCurrentChange"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="refreshLogs">刷 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQuartzList, getQuartzLogList, delJobByIds, pauseJobByIds, resumeJobByIds, runByIds, saveOrUpdateJob } from '@/api/quartz'

export default {
  data() {
    return {
      listLoading: true,
      logsLoading: false,
      dialogFormVisible: false,
      dialogLogVisible: false,
      logs: {
        id: '',
        jobId: '',
        beanName: '',
        methodName: '',
        params: '',
        status: '',
        times: '',
        createTime: ''
      },
      form: {
        id: '',
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0
      },
      rules: {
        beanName: [
          { required: true, message: '请输入bean名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      total: 0,
      logsTotal: 0,
      logsQuery: {
        jobId: '',
        pageNum: 1,
        pageSize: 10
      },
      listQuery: {
        beanName: '',
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      logList: [],
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
      getQuartzList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getLogList() {
      this.logsLoading = true
      getQuartzLogList(this.logsQuery).then(response => {
        this.logList = response.data.list
        this.logsTotal = response.data.total
        this.logsLoading = false
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
    handleLogSizeChange(val) {
      this.logsQuery.pageSize = val
      this.getLogList()
    },
    handleLogCurrentChange(val) {
      this.logsQuery.pageNum = val
      this.getLogList()
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    logSearch() {
      this.logsQuery.pageNum = 1
      this.getLogList()
    },
    deleteJob(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delJobByIds([id]).then(response => {
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
          message: '请勾选要删除的任务！'
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
          delJobByIds(ids).then(response => {
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
    pauseJob(id) {
      this.$confirm('确定暂停？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pauseJobByIds([id]).then(response => {
          this.$message({
            type: 'success',
            message: '暂停成功'
          })
          this.getList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    batchPause() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要暂停的任务！'
        })
      } else {
        this.$confirm('确定暂停？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (var i = this.multipleSelection.length - 1; i >= 0; i--) {
            ids.push(this.multipleSelection[i].id)
          }
          pauseJobByIds(ids).then(response => {
            this.$message({
              type: 'success',
              message: '暂停成功'
            })
            this.getList()
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    resumeJob(id) {
      this.$confirm('确定恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resumeJobByIds([id]).then(response => {
          this.$message({
            type: 'success',
            message: '恢复成功'
          })
          this.getList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    batchResume() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要恢复的任务！'
        })
      } else {
        this.$confirm('确定恢复？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (var i = this.multipleSelection.length - 1; i >= 0; i--) {
            ids.push(this.multipleSelection[i].id)
          }
          resumeJobByIds(ids).then(response => {
            this.$message({
              type: 'success',
              message: '恢复成功'
            })
            this.getList()
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    runJob(id) {
      this.$confirm('确定执行？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        runByIds([id]).then(response => {
          this.$message({
            type: 'success',
            message: '执行成功'
          })
          this.getList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    batchRun() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要执行的任务！'
        })
      } else {
        this.$confirm('确定执行？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (var i = this.multipleSelection.length - 1; i >= 0; i--) {
            ids.push(this.multipleSelection[i].id)
          }
          runByIds(ids).then(response => {
            this.$message({
              type: 'success',
              message: '执行成功'
            })
            this.getList()
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    resetFrom() {
      this.$refs.form.clearValidate()
    },
    saveJob(str) {
      this.$refs[str].validate((valid) => {
        if (valid) {
          saveOrUpdateJob(this.form).then(response => {
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
    jobFormInit(obj) {
      if (obj) {
        this.form.id = obj.id
        this.form.beanName = obj.beanName
        this.form.methodName = obj.methodName
        this.form.params = obj.params
        this.form.cronExpression = obj.cronExpression
        this.form.remark = obj.remark
        this.form.status = obj.status
      } else {
        this.form.id = ''
        this.form.beanName = ''
        this.form.methodName = ''
        this.form.params = ''
        this.form.cronExpression = ''
        this.form.remark = ''
        this.form.status = 0
      }
      this.dialogFormVisible = true
    },
    jobLog() {
      this.getLogList()
      this.dialogLogVisible = true
    },
    refreshLogs() {
      this.logsQuery.pageNum = 1
      this.getLogList()
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
