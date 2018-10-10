<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-button type="primary" @click="addPerm">添加权限</el-button>
      <el-button @click="groupFormVisible = true">添加权限组</el-button>
      <el-button type="danger" plain @click="batchDel">批量删除</el-button>
    </el-row>
    <el-row class="row-bg">
      <el-col :span="6">
        <el-alert
          :closable="false"
          :title="'当前选择编辑: ' + form.description"
          type="success"
          show-icon/>
        <el-tree ref="tree" :data="pData" :props="defaultProps" :highlight-current="true" :expand-on-click-node="isOpen" show-checkbox node-key="pData.id" @node-click="handleNodeClick"/>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" :label-position="position" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="form.description"/>
          </el-form-item>
          <el-form-item label="权限组" prop="groupName">
            <el-input v-if="form.isGroup" v-model="form.groupName"/>
            <el-select v-else v-model="form.groupName" placeholder="请选择">
              <el-option
                v-for="item in groupData"
                :key="item.key"
                :label="item.description"
                :value="item.groupName"/>
            </el-select>
          </el-form-item>
          <el-form-item label="权限" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="update">保存并更新</el-button>
            <el-button plain @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 新增 Form -->
    <el-dialog :visible.sync="permFormVisible" title="新增权限" @closed="resetPermForm">
      <el-form ref="permForm" :model="permForm" :rules="permFormRules" label-width="80px">
        <el-form-item label="权限组" prop="groupName">
          <el-select v-model="permForm.groupName" placeholder="请选择">
            <el-option
              v-for="item in groupData"
              :key="item.key"
              :label="item.description"
              :value="item.groupName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="permForm.description"/>
        </el-form-item>
        <el-form-item label="权限" prop="name">
          <el-input v-model="permForm.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePerm">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 权限组 Form -->
    <el-dialog :visible.sync="groupFormVisible" title="新增权限组" @closed="resetgroupForm">
      <el-form ref="groupForm" :model="groupForm" :rules="groupFormRules" label-width="80px">
        <el-form-item label="权限组" prop="groupName">
          <el-input v-model="groupForm.groupName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, saveOrUpdatePerm, batchDelPerms } from '@/api/permission'

export default {
  data() {
    var myValidate = (rule, value, callback) => {
      if (!this.form.isGroup && value === '') {
        callback(new Error('请输入权限名'))
      } else {
        callback()
      }
    }

    var myValidate2 = (rule, value, callback) => {
      if (this.form.isGroup && value === '') {
        callback(new Error('请输入组名'))
      } else {
        callback()
      }
    }
    return {
      pData: [],
      position: 'right',
      isOpen: false,
      permFormVisible: false,
      groupFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'description'
      },
      form: {
        id: '',
        name: '',
        isGroup: false,
        groupName: '',
        description: ''
      },
      rules: {
        name: [
          { validator: myValidate, trigger: 'blur' }
        ],
        groupName: [
          { validator: myValidate2, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ]
      },
      permForm: {
        id: '',
        name: '',
        isGroup: false,
        groupName: '',
        description: ''
      },
      permFormRules: {
        groupName: [
          { required: true, message: '请选择权限组名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入权限名', trigger: 'blur' }
        ]
      },
      groupForm: {
        id: '',
        name: '',
        isGroup: true,
        groupName: '',
        description: ''
      },
      groupFormRules: {
        groupName: [
          { required: true, message: '请输入权限组名', trigger: 'blur' }
        ]
      },
      formLabelWidth: 100,
      groupData: []
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    getAll() {
      getAll().then(response => {
        this.pData = response.data
        this.groupData = []
        if (response.data) {
          for (var i = 0; i <= response.data.length - 1; i++) {
            this.groupData.push(response.data[i])
            this.groupData[i]['key'] = i
          }
        }
      })
    },
    handleNodeClick(data, node, e) {
      this.$refs.form.clearValidate()
      this.form.id = data.id
      this.form.name = data.name
      this.form.isGroup = data.isGroup
      this.form.groupName = data.groupName
      this.form.description = data.description
    },
    resetForm() {
      this.form.id = ''
      this.form.name = ''
      this.form.isGroup = false
      this.form.groupName = ''
      this.form.description = ''
      this.$refs.form.clearValidate()
    },
    resetPermForm() {
      this.permForm.id = ''
      this.permForm.name = ''
      this.permForm.isGroup = false
      this.permForm.groupName = ''
      this.permForm.description = ''
      this.$refs.permForm.clearValidate()
    },
    resetgroupForm() {
      this.groupForm.id = ''
      this.groupForm.name = ''
      this.groupForm.isGroup = true
      this.groupForm.groupName = ''
      this.groupForm.description = ''
      this.$refs.groupForm.clearValidate()
    },
    batchDel() {
      const perms = this.$refs.tree.getCheckedNodes()
      if (perms.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要删除的权限'
        })
        return false
      }
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelPerms(perms).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getAll()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    update() {
      if (this.form.id === '') {
        this.$message({
          type: 'warning',
          message: '请选择一个权限'
        })
        this.$refs.form.clearValidate()
        return false
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          saveOrUpdatePerm(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getAll()
          })
        } else {
          return false
        }
      })
    },
    addPerm() {
      this.permFormVisible = true
    },
    savePerm() {
      this.$refs.permForm.validate((valid) => {
        if (valid) {
          saveOrUpdatePerm(this.permForm).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getAll()
            this.permFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    saveGroup() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          this.groupForm.description = this.groupForm.groupName
          saveOrUpdatePerm(this.groupForm).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getAll()
            this.groupFormVisible = false
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

  .el-col {
    border-radius: 4px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
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
