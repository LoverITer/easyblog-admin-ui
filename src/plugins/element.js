import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载 element-ui 的message 组件到 vue 实例
Vue.prototype.$message = Message
