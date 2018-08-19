<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="$router.push('/Add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodList" style="width:100%;">
      <el-table-column type="index" :index="indexMethods"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [],
      current: 1,
      pageSize: 10,
      total: 1
    }
  },
  methods: {
    async getgoodList () {
      const res = await this.axios.get('goods', {
        params: {
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      }
    },
    // 处理每页的条数
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.getgoodList()
    },
    // 处理当前页
    handleCurrentChange (val) {
      this.current = val
      this.getgoodList()
    },
    // 处理索引
    indexMethods (index) {
      return (this.current - 1) * this.pageSize + index + 1
    }
  },
  created () {
    this.getgoodList()
  }
}
</script>

<style>

</style>
