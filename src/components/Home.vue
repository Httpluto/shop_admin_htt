<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="logout">
          欢迎光临
          <a href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="title">
          电商后台管理系统
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            unique-opened
            :default-active="$route.path.slice(1)"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{l1.authName}}</span>
              </template>
              <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{l2.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出
    async logout () {
      try {
        await this.$confirm('你确定要退出系统吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('myToken')
        this.$router.push('login')
      } catch (e) {
        this.$message.info('退出取消')
      }
    },
    // 获取左边菜单的数据
    async getMenuList () {
      const res = await this.axios.get('menus')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less">
.home {
  height: 100%;
  > .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #b3c1cd;
    .logo {
      float: left;
      width: 180px;
      height: 60px;
      background: url(../assets/logo.png) no-repeat center center;
      background-size: contain;
    }

    .logout {
      float: right;
      width: 180px;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      font-weight: 700;
      text-align: right;

      a {
        color: darkorange;
      }
    }

    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      color: #fff;
      text-align: center;
      font-size: 24px;
    }
  }

  .el-aside {
    background-color: #545C64;
    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #EAEEF1;
  }
}
</style>
