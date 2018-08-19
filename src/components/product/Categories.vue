<template>
  <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="catList"
      style="width:100%"
      v-loading="loading">
      <!-- treeKey:指定节点嵌套的一个key,只有指定了展开的节点才能在对应的位置 -->
      <!-- level-key:指定节点层级,缩进效果 -->
      <!-- parent-key:指定父节点的key,不指定无法缩回去 -->
      <!-- child-key:指定数据中的子节点的属性名, 默认children -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column label="是否有效" prop="cat_deleted">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteCat(scope.row.cat_id)"></el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      :current-page="current"
      :total="total">
    </el-pagination>
    <!-- 增加用户 -->
    <el-dialog
      title="增加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            change-on-select
            :props="props"
            v-model="addForm.cat_pid">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加分类 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="addRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入树形网格组件
import ElTreeGrid from 'element-tree-grid'

export default {
  data () {
    return {
      current: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        id: ''
      },
      addRules: {
        cat_name: [
          {required: true, message: '请输入分类的名称', trigger: 'blur'}
        ]
      },
      catList: [],
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    async getCatList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.catList = data.result
        this.total = data.total
        this.loading = false
      }
    },
    // 处理当前页发生改变
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getCatList()
    },
    handleSizeChange (val) {
      this.loading = true
      this.pagesize = val
      this.current = 1
      this.getCatList()
    },
    // 添加框
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories?type=2')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加分类
    addCat () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          console.log(this.addForm.cat_name, this.addForm.cat_pid)
          const {cat_name: catName, cat_pid: catPid} = this.addForm
          const res = await this.axios.post('categories', {
            cat_pid: catPid[catPid.length - 1],
            cat_name: catName,
            cat_level: catPid.length
          })
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getCatList()
            this.$message.success('添加分类成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除分类
    async deleteCat (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.getCatList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 修改对话框
    showEditDialog (cat) {
      this.editDialogVisible = true
      this.editForm.id = cat.cat_id
      this.editForm.cat_name = cat.cat_name
    },
    // 修改分类
    editCat () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await this.axios.put(`categories/${this.editForm.id}`, this.editForm)
        const {meta} = res.data
        if (meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getCatList()
          this.$message.success('修改成功')
        }
      })
    }
  },
  created () {
    this.getCatList()
  },
  // 局部组件
  components: {
    // es6的属性名表达式,允许用[]括起来一个表达式
    [ElTreeGrid.name]: ElTreeGrid
  }
}
</script>

<style>

</style>
