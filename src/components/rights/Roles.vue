<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button style="margin-bottom:20px;" plain type="success" @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width:100%;">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级 -->
          <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag type="warning" closable @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级 -->
              <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col class="level2" :span="4">
                  <el-tag  type="success" closable @close="deleteRight(scope.row, level2.id)">{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级 -->
                  <span class="mr_10" v-for="level3 in level2.children" :key="level3.id">
                    <el-tag closable @close="deleteRight(scope.row, level3.id)">{{level3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignRight(scope.row)">分配权限</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="增加角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="Rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="Rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%">
      <!-- 树形结构 -->
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      Rules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignDialogVisible: false,
      rightList: [],
      defaultProps: { // 树形结构的数据
        label: 'authName', // 指定节点文本的一个属性
        children: 'children' // 用户指定子树节点的属性
      },
      assignRoleId: ''
    }
  },
  methods: {
    // 获取所有的角色列表
    async getRoleList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 删除角色
    async deleteRole (role) {
      try {
        // 确认框
        await this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${role.id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('roles', this.addForm)
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            // 重置表单样式
            this.$refs.addForm.resetFields()
            this.getRoleList()
            this.$message.success('添加成功')
          }
        } else {
          return false
        }
      })
    },
    // 显示修改对话框
    showEditDialog (role) {
      // console.log(role)
      this.editDialogVisible = true
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
      this.editForm.id = role.id
    },
    // 修改角色
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getRoleList()
            this.$message.success('修改成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除权限(小标签)
    async deleteRight (role, rightId) {
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        // 重新渲染,修改role的children,不用渲染所有的列表
        role.children = data
        this.$message.success('删除成功')
      }
    },
    // 分配权限的对话框
    async showAssignRight (role) {
      this.assignDialogVisible = true
      const res = await this.axios.get('rights/tree')
      const {meta, data} = res.data
      this.assignRoleId = role.id
      if (meta.status === 200) {
        this.rightList = data
        // 获取到当前角色下所有的三级权限
        const checkdKey = []
        role.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkdKey.push(level3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(checkdKey)
      }
    },
    // 分配权限操作
    async assignRight () {
      // 获取选中的id
      let checkedKey = this.$refs.tree.getCheckedKeys()
      // 获取半选中的id
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        // ...运算符 -----> 展开 : [...[1,2], 3]  -> [1,2,3]
        rids: [...checkedKey, ...halfCheckedKeys].join()
      })
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
        this.$message.success('分配权限成功')
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style>
.el-breadcrumb{
  height: 30px;
  line-height: 30px;
}
.level1{
  margin-bottom: 10px;
  border-bottom: 1px dotted #ccc;
}
.level2{
  margin-bottom: 10px;
}
.mr_10{
  margin-right: 10px;
}
</style>
