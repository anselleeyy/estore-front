import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('../page/index')
const Home = () => import('../page/Home/home')
const Login = () => import('../page/Login/login')
const Goods = () => import('../page/Goods/goods')
const goodsDetail = () => import('../page/Goods/goodsDetail')

// 用户中心
const user = () => import('../page/User/user')
const addressList = () => import('../page/User/children/addressList')
const information = () => import('../page/User/children/information')
const orderCenter = () => import('../page/User/children/order')

// 购物车
const cart = () => import('../page/Cart/cart')
const checkOut = () => import('../page/CheckOut/checkout')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        { path: 'home', component: Home },
        { path: 'goods', component: Goods },
        { path: 'goodsDetail', component: goodsDetail, name: 'goodsDetail' }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      redirect: '/user/information',
      children: [
        { path: 'orderCenter', name: '订单列表', component: orderCenter },
        { path: 'information', name: '账户资料', component: information },
        { path: 'addressList', name: '收货地址', component: addressList }
      ]
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/checkOut',
      name: 'checkout',
      component: checkOut
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
