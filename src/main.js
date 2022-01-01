import Vue from 'vue'
import App from './App.vue'
import index from './router'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
// 将axios挂载到vue实例上
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
new Vue({
  router: index,
  render: c => c(App)
}).$mount('#app')
