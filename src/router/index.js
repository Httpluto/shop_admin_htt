import Vue from 'vue'
import Router from 'vue-router'

// 引入Login.vue组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName:'login' */ '@/components/Login')

// 引入Home.vue组件
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName:'home' */ '@/components/Home')

// 引入Users.vue组件
// import Users from '@/components/users/Users'
const Users = () => import(/* webpackChunkName:'Users' */ '@/components/users/Users')

// 引入Rights.vue组件
// import Rights from '@/components/rights/Rights'
const Rights = () => import(/* webpackChunkName:'Rights' */ '@/components/rights/Rights')

// 引入Roles.vue组件
// import Roles from '@/components/rights/Roles'
const Roles = () => import(/* webpackChunkName:'Roles' */ '@/components/rights/Roles')

// 引入Categories.vue组件
// import Categories from '@/components/product/Categories'
const Categories = () => import(/* webpackChunkName:'Categories' */ '@/components/product/Categories')

// 引入Goods.vue组件
// import Goods from '@/components/product/Goods'
const Goods = () => import(/* webpackChunkName:'Goods' */ '@/components/product/Goods')

// 引入Add.vue组件
// import Add from '@/components/product/Add'
const Add = () => import(/* webpackChunkName:'Goods' */ '@/components/product/Add')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/add',
          name: 'add',
          component: Add
        }
      ]
    }
  ]
})

// 给router配置守卫导航
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('myToken')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
