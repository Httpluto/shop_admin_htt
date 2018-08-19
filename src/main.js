// 引入Element-UI
import ElementUI from 'element-ui'
// 引入Element-UI的样式
// import 'element-ui/lib/theme-chalk/index.css'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 打包的时候，把第三方的样式放到最前面导入，方便覆盖

import Vue from 'vue'
import App from './App'
import router from './router'

// 导入axios
import axios from 'axios'

// 导入moment
import moment from 'moment'

// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 使用插件富文本编辑器
Vue.use(VueQuillEditor)

// 使用element-ui
Vue.use(ElementUI)

// 时间过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

// 把axios对象绑定到Vue原型上
Vue.prototype.axios = axios

// 设置axios的默认配置
// 会在切换用户登录的之后,无法获取到新的token,导致页面无法正产加载,必须使用 请求前拦截 的方法
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

axios.interceptors.request.use(function (config) {
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.common['Authorization'] = localStorage.getItem('myToken')
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
