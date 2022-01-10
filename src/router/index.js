import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Register from '../components/Register'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Footer from '../components/footer/Footer'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import GoodsCategory from '../components/goods/Category'
import Goods from '../components/goods/Goods'
import CategoryConfigure from '../components/goods/CategoryConfigure'
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
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          components: {
            'default': Welcome,
            'Footer': Footer
          }
        },
        {
          path: '/users',
          components: {
            'default': User,
            'Footer': Footer
          }
        },
        {
          path: '/rights',
          components: {
            'default': Rights,
            'Footer': Footer
          }
        },
        {
          path: '/roles',
          components: {
            'default': Roles,
            'Footer': Footer
          }
        },
        {
          path:'/categories',
          components:{
            default: GoodsCategory,
            'Footer': Footer
          }
        },
        {
          path:'/goods',
          components:{
            default: Goods,
            'Footer': Footer
          }
        },
        {
          path:'/params',
          components:{
            default: CategoryConfigure,
            'Footer': Footer
          }
        }
      ]
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
