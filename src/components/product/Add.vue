<template>
  <div class="add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tab栏切换 -->
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 表单 -->
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              :props="props"
              v-model="addForm.goods_cat"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 上传图片 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      options: [],
      activeName: 'basic',
      addForm: {
        good_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: true,
        pics: []
      },
      headers: {
        Authorization: localStorage.getItem('myToken')
      },
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    // tab栏切换
    handleClick (tab) {
      this.active = +tab.index
    },
    // 下一步
    next (active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 删除图片
    handleRemove (file, fileList) {
      // 根据删除的file得到删除图片的地址
      let tpmPath = file.response.data.tpm_path
      // 删除pics中对应的数据
      let idx = this.addForm.pics.findIndex(item => item.pic === tpmPath)
      this.addForm.pics.splice(idx, 1)
    },
    // 添加图片
    handleSuccess (res, file, fileList) {
      if (res.meta.status === 200) {
        this.addForm.pics.push({pics: res.data.tmp_path})
      }
    },
    async addGood () {
      const res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      const {meta} = res.data
      if (meta.status === 201) {
        this.$router.push('/goods')
        this.$message.success('商品添加成功')
      }
    }
  },
  async created () {
    // 获取到所有的商品分类数据(3)
    const res = await this.axios.get('categories?type=3')
    const {meta, data} = res.data
    if (meta.status === 200) {
      this.options = data
    }
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
}
.quill-editor {
  background-color: #fff;
}
</style>
