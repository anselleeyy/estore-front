// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import store from './store/'
import { getStore } from './utils/storage'
import { userInfo } from './api'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
Vue.prototype.$loading = ElementUI.Loading.service
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$message = ElementUI.Message

const whiteList = [ '/', '/home', '/login', '/goodsDetail', '/goods', '/search', '/refreshSearch' ]
router.beforeEach(function (to, from, next) {
  let params = {
    token: getStore('token')
  }
  userInfo(params).then(res => {
    if (res.result.state !== 1) { // 没登录
      if (whiteList.indexOf(to.path) !== -1) { // 白名单
        next()
      } else {
        next('/login')
      }
    } else {
      store.commit('RECORD_USERINFO', { info: res.result.user })
      if (to.path === '/login') { //  跳转到
        next({ path: '/' })
      }
      next()
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
