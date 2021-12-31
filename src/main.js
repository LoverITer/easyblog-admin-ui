import Vue from 'vue'
import App from './App.vue'
import index from './router'
import './plugins/element.js'
import './assets/global.css'

Vue.config.productionTip = false

new Vue({
  router: index,
  render: c => c(App)
}).$mount('#app')
