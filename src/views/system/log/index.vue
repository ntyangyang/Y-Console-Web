<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-input v-model="listQuery.name" placeholder="用户名 or 操作名称" class="input-with-search">
        <el-button slot="append" type="primary" icon="el-icon-search" plain @click="search">搜索</el-button>
      </el-input>
    </el-row>
    <el-row class="row-bg">
      <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" fit highlight-current-row style="width: 100%">
        <el-table-column label="ID" width="160px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作名称" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.operation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求方法" width="300" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.method }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求参数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.params }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时长(毫秒)" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP地址" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP信息" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ipInfo }}</span>
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
  </div>
</template>

<script>
import { getLogList } from '@/api/log'

export default {
  data() {
    return {
      listLoading: true,
      form: {
        id: '',
        username: '',
        operation: '',
        method: '',
        params: '',
        time: '',
        ip: '',
        ipInfo: '',
        createTime: ''
      },
      total: 0,
      logsTotal: 0,
      listQuery: {
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLogList(this.listQuery).then(response => {
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
