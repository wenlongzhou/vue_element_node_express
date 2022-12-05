<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">创建人员</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.user }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.roles }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改人员':'新建人员'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="人员名称">
          <el-input v-model="user.user" placeholder="人员名称" />
        </el-form-item>
        <el-form-item label="人员密码">
          <el-input v-model="newPassword" placeholder="人员密码" type="password" />
        </el-form-item>
        <el-form-item label="人员权限">
          <el-select v-model="roles" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { userList, addUser, updateUser, deleteUser } from '@/api/user'
import { roleList } from '@/api/role'
import md5 from 'md5'

const defaultUser = {
  id: '',
  user: '',
  password: '',
  remark: ''
}

export default {
  name: 'Permission',
  data() {
    return {
      user: Object.assign({}, defaultUser),
      userList: [],
      roleList: [],
      roles: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      newPassword: ''
    }
  },
  created() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async getUsers() {
      const res = await userList()
      this.userList = res.list
    },
    async getRoles() {
      const res = await roleList()
      this.roleList = res.list
    },
    handleAddUser() {
      this.role = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.user = deepClone(scope.row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.roles = scope.row.role_ids.split(',').map(item => parseInt(item))
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该人员吗？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser({ id: row.id })
          location.reload()
        })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      const data = deepClone(this.user)
      data.role_ids = this.roles.join(',')
      if (this.newPassword) data.password = md5(this.newPassword)
      if (isEdit) {
        await updateUser(data)
      } else {
        await addUser(data)
      }

      this.newPassword = ''
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
