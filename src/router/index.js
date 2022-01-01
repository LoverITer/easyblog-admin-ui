import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Register from '../components/Register'
import Welcome from '../components/Welcome'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children:[
        { path: '/welcome',component: Welcome }
      ]
    },
    {
      path: '/register',
      component: Register
    }
  ]
})

// 路由导航守卫，对访问的url进行权限控制
router.beforeEach((to, from, next) => {
  // to 将要访问那个页面
  // from 从那个页面跳转来
  // next 一个函数 调用它可以放行
  if (to.path === '/login' || to.path === '/register') return next()
  const token = window.sessionStorage.getItem('LOGIN_TOKEN')
  if (!token) {
    // token 不存在，用户没有访问权限
    return next('/login')
  }
  // token 存在，有访问权限，放行
  next()
})

export default router
