<template>
  <div class="app-container">
    <el-row class="row-bg">
      <el-button type="primary" @click="addFormVisible = true">添加菜单</el-button>
      <el-button type="danger" plain @click="batchDel">批量删除</el-button>
    </el-row>
    <el-row class="row-bg">
      <el-col :span="6">
        <el-alert
          :closable="false"
          :title="'当前选择编辑: ' + updateForm.name"
          type="success"
          show-icon/>
        <el-tree ref="tree" :data="menuData" :highlight-current="true" :props="defaultProps" :expand-on-click-node="isOpen" show-checkbox node-key="menuData.id" @node-click="handleNodeClick"/>
      </el-col>
      <el-col :span="10">
        <el-form ref="updateForm" :label-position="position" :model="updateForm" :rules="rules" label-width="100px">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="updateForm.name"/>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio v-model="updateForm.type" :label="0">目录</el-radio>
            <el-radio v-model="updateForm.type" :label="1">菜单</el-radio>
          </el-form-item>
          <el-form-item label="页面路径" prop="path">
            <el-input v-model="updateForm.path"/>
          </el-form-item>
          <el-form-item label="前端组件" prop="component">
            <el-input v-model="updateForm.component"/>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="updateForm.icon"/>
          </el-form-item>
          <el-form-item v-show="false" label="上级菜单" prop="parentId">
            <el-input v-model="updateForm.parentId"/>
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentIds">
            <el-cascader
              v-model="updateForm.parentIds"
              :options="menuData"
              :props="menuProps"
              :show-all-levels="false"
              placeholder="请选择"
              change-on-select/>
          </el-form-item>
          <el-form-item label="备注说明" prop="icon">
            <el-input v-model="updateForm.description"/>
          </el-form-item>
          <el-form-item label="排序值" prop="sortOrder">
            <el-input-number v-model="updateForm.sortOrder" :precision="2" :step="1.0" :min="0" :max="100" size="mini" controls-position="right"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="updateForm.status" :label="0">启用</el-radio>
            <el-radio v-model="updateForm.status" :label="1">禁用</el-radio>
          </el-form-item>
          <el-form-item label="网页链接" prop="url">
            <el-input v-model="updateForm.url"/>
          </el-form-item>
          <el-form-item label="可访问角色">
            <el-checkbox-group v-model="updateForm.roleIds">
              <el-checkbox v-for="role in allRoles" :label="role.id" :key="role.id">{{ role.description }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="updateMenu">保存并更新</el-button>
            <el-button plain @click="resetUpdateForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 新增 Form -->
    <el-dialog :visible.sync="addFormVisible" title="新增菜单" @closed="resetAddForm">
      <el-form ref="addForm" :label-position="position" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name"/>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="addForm.type" :label="0">目录</el-radio>
          <el-radio v-model="addForm.type" :label="1">菜单</el-radio>
        </el-form-item>
        <el-form-item label="页面路径" prop="path">
          <el-input v-model="addForm.path"/>
        </el-form-item>
        <el-form-item label="前端组件" prop="component">
          <el-input v-model="addForm.component"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="addForm.icon"/>
        </el-form-item>
        <el-form-item v-show="false" label="上级菜单" prop="parentId">
          <el-input v-model="addForm.parentId"/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentIds">
          <el-cascader
            v-model="addForm.parentIds"
            :options="menuData"
            :props="menuProps"
            :show-all-levels="false"
            placeholder="请选择"
            change-on-select/>
        </el-form-item>
        <el-form-item label="备注说明" prop="icon">
          <el-input v-model="addForm.description"/>
        </el-form-item>
        <el-form-item label="排序值" prop="sortOrder">
          <el-input-number v-model="addForm.sortOrder" :precision="2" :step="1.0" :min="0" :max="100" size="mini" controls-position="right"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="addForm.status" :label="0">启用</el-radio>
          <el-radio v-model="addForm.status" :label="1">禁用</el-radio>
        </el-form-item>
        <el-form-item label="网页链接" prop="url">
          <el-input v-model="addForm.url"/>
        </el-form-item>
        <el-form-item label="可访问角色">
          <el-checkbox-group v-model="addForm.roleIds">
            <el-checkbox v-for="role in allRoles" :label="role.id" :key="role.id">{{ role.description }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, getMenuRoles, saveOrUpdateMenu, batchDelMenus } from '@/api/menu'
import { getRoleList } from '@/api/user'

export default {
  data() {
    return {
      menuData: [],
      position: 'right',
      isOpen: false,
      addFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      updateForm: {
        id: '',
        name: '',
        type: 0,
        path: '',
        component: '',
        icon: '',
        parentId: 0,
        parentIds: [],
        description: '',
        sortOrder: 0,
        status: 0,
        url: '',
        roleIds: []
      },
      addForm: {
        id: '',
        name: '',
        type: 0,
        path: '',
        component: '',
        icon: '',
        parentId: 0,
        parentIds: [],
        description: '',
        sortOrder: 0,
        status: 0,
        url: '',
        roleIds: []
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入前端组件', trigger: 'blur' }
        ],
        parentIds: [
          { required: true, message: '请选择上级目录', trigger: 'blur' }
        ]
      },
      allRoles: []
    }
  },
  created() {
    this.getAll()
    this.getRoleList()
  },
  methods: {
    getAll() {
      getAll().then(response => {
        this.menuData = response.data
      })
    },
    getCascaderVal(opt, val) {
      for (const item of opt) {
        const arr = []
        if (item.id === val) {
          arr.push(item.id)
          return arr
        } else {
          if (item.children.length > 0) {
            const temp = this.getCascaderVal(item.children, val)
            if (temp) {
              temp.push(item.id)
              return temp
            }
          }
        }
      }
      return null
    },
    getRoleList() {
      getRoleList().then(response => {
        this.allRoles = response.data
      })
    },
    handleNodeClick(data, node, e) {
      if (data.id === '0') {
        this.$message({
          type: 'warning',
          message: '根节点不能编辑!'
        })
        return false
      }
      this.$refs.updateForm.clearValidate()
      this.updateForm.id = data.id
      this.updateForm.name = data.name
      this.updateForm.type = data.type
      this.updateForm.path = data.path
      this.updateForm.component = data.component
      this.updateForm.icon = data.icon
      this.updateForm.parentId = data.parentId
      const arr = this.getCascaderVal(this.menuData, data.parentId.toString())
      if (arr) {
        this.updateForm.parentIds = arr.reverse()
      } else {
        this.updateForm.parentIds = []
      }
      getMenuRoles(data.id).then(response => {
        this.updateForm.roleIds = []
        for (var i = response.data.length - 1; i >= 0; i--) {
          this.updateForm.roleIds.push(response.data[i].id)
        }
      })
      this.updateForm.description = data.description
      this.updateForm.sortOrder = data.sortOrder
      this.updateForm.status = data.status
      this.updateForm.url = data.url
    },
    resetUpdateForm() {
      this.updateForm.id = 0
      this.updateForm.name = ''
      this.updateForm.type = 0
      this.updateForm.path = ''
      this.updateForm.component = ''
      this.updateForm.icon = ''
      this.updateForm.parentId = 0
      this.updateForm.parentIds = []
      this.updateForm.description = ''
      this.updateForm.sortOrder = 0
      this.updateForm.status = 0
      this.updateForm.url = ''
      this.$refs.updateForm.clearValidate()
    },
    resetAddForm() {
      this.addForm.id = 0
      this.addForm.name = ''
      this.addForm.type = 0
      this.addForm.path = ''
      this.addForm.component = ''
      this.addForm.icon = ''
      this.addForm.parentId = 0
      this.addForm.parentIds = []
      this.addForm.description = ''
      this.addForm.sortOrder = 0
      this.addForm.status = 0
      this.addForm.url = ''
      this.$refs.addForm.clearValidate()
    },
    batchDel() {
      const menus = this.$refs.tree.getCheckedNodes()
      if (menus.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要删除的菜单'
        })
        return false
      }

      if (menus.length === 1 && menus[0].id === '0') {
        this.$message({
          type: 'warning',
          message: '根节点无法删除'
        })
        return false
      }

      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelMenus(menus).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getAll()
          this.getRoleList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateMenu() {
      if (this.updateForm.id === '') {
        this.$message({
          type: 'warning',
          message: '请选择一个菜单'
        })
        this.$refs.updateForm.clearValidate()
        return false
      }

      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          const l = this.updateForm.parentIds.length - 1
          this.updateForm.parentId = this.updateForm.parentIds[l]
          saveOrUpdateMenu(this.updateForm).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getAll()
            this.getRoleList()
          })
        } else {
          return false
        }
      })
    },
    saveMenu() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const l = this.addForm.parentIds.length - 1
          this.addForm.parentId = this.addForm.parentIds[l]
          saveOrUpdateMenu(this.addForm).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getAll()
            this.getRoleList()
            this.addFormVisible = false
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
