import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
//导入树形表格
import ZkTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//导入富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import * as echarts from 'echarts'


//注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)
Vue.use(ZkTable)
Vue.config.productionTip = false
// 将axios挂载到vue实例上
Vue.prototype.$http = axios
//挂载echarts
Vue.prototype.$echarts = echarts
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器，对请求进行预处理：1、添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('LOGIN_TOKEN')
  //最后需要返回此config
  return config
})
//注册全局日期过滤器：yyyy-MM-dd hh:mm:ss
Vue.filter('simpleDateFormat', function (timestamp) {
  if (timestamp != null) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const mon = (date.getMonth() + 1 + '').padStart(2, '0')
    const day = (date.getMonth() + 1 + '').padStart(2, '0')
    const hour = (date.getMonth() + 1 + '').padStart(2, '0')
    const min = (date.getMonth() + 1 + '').padStart(2, '0')
    const sec = (date.getMonth() + 1 + '').padStart(2, '0')

    return `${year}-${mon}-${day} ${hour}:${min}:${sec}`
  }
  return ''
})
new Vue({
  router: router,
  render: c => c(App)
}).$mount('#app')
