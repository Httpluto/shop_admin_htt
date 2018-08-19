<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>

    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="200">
        <!-- 1. 表示表格的自定义列模板，意味着这一列显示的数据自己来定义了 -->
        <!-- 2. 通过scope.row可以获取到当前行的数据 -->
        <template slot-scope="scope">
          <!-- scope.row可以获取到整行的数据 -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
         <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 增加用户 -->
    <el-dialog
      title="增加用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="70px"
        :rules="addRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="70px"
        :rules="addRules">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '', // 关键字
      current: 1,
      pagesize: 2,
      total: 0,
      userList: [],
      addDialogVisible: false, // 添加的对话框, 默认不显示
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱的格式', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入正确的手机格式', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        username: '',
        rid: '',
        id: ''
      },
      options: []
    }
  },
  methods: {
    async getUserList () {
      // 发送ajax请求，获取到用户列表的数据
      const res = await this.axios({
        method: 'get',
        url: 'users',
        // 如果是get请求的参数，要不就拼到url后面
        // 使用params参数，不能使用data
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      const {meta, data} = res.data
      // console.log(res.data)
      if (meta.status === 200) {
        // 获取到数据了
        this.userList = data.users
        this.total = data.total
      }
    },
    handleCurrentChange (val) {
      this.current = val
      this.getUserList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1
      this.getUserList()
    },
    search () {
      this.current = 1
      this.getUserList()
    },
    async changeState (user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('修改用户状态成功')
      } else {
        this.$message.error('修改用户状态失败')
      }
    },
    async deleteUser (user) {
      try {
        await this.$confirm('你确定要删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`users/${user.id}`)
        const {status} = res.data.meta
        if (status === 200) {
          if (this.userList.length === 1) {
            this.current--
          }
          this.getUserList()
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.axios.post('users', this.addForm).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 201) {
              this.addDialogVisible = false
              this.$refs.addForm.resetFields()
              this.total++
              this.current = Math.ceil(this.total / this.pagesize)
              this.getUserList()
              this.$message.success('添加用户成功')
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    showEditDialog (user) {
      this.editDialogVisible = true
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.id = user.id
    },
    editUser () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios.put(`users/${this.editForm.id}`, this.editForm).then(res => {
            if (res.data.meta.status === 200) {
              this.editDialogVisible = false
              this.$refs.editForm.resetFields()
              this.getUserList()
              this.$message.success('用户修改成功')
            }
          })
        } else {
          return false
        }
      })
    },
    // 显示分配角色的对话框
    async showAssignDialog (user) {
      // console.log(user)
      this.assignDialogVisible = true
      // 回显
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      // 回显角色id,数据库中获取
      const res2 = await this.axios.get(`users/${user.id}`)
      if (res2.data.meta.status === 200) {
        if (res2.data.data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = res2.data.data.rid
        }
      }
      // 获取所有的角色列表数据
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
        // console.log(this.options)
      }
    },
    // 分配的角色
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      if (res.data.meta.status === 200) {
        this.assignDialogVisible = false
        this.getUserList()
        this.$message.success('分配用户成功')
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
