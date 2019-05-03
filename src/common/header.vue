<template>
  <div class="header-box">
    <div>
      <header class="w">
        <div class="w-box">
          <div class="nav-logo">
            <h1 @click="changePage(0, '/')">
              <router-link to="/" title="e-store">e-store 书城</router-link>
            </h1>
          </div>
          <div class="right-box">
            <div class="nav-list">
              <el-input
                placeholder="请输入关键词"
                suffix-icon="el-icon-search"
                v-model="input"
                minlength=1
                maxlenght=100
                @select="handleSelect"
                @keydown.enter.native="handleIconClick">
              </el-input>
              <!--<router-link to="/goods"><a @click="changePage(2)">全部商品</a></router-link>-->
              <!--<router-link to="/thanks"><a @click="changePage(4)">xxx</a></router-link>-->
            </div>
            <div class="nav-aside" ref="aside" :class="{ fixed: st }">
              <div class="user pr">
                <router-link to="/user">个人中心</router-link>
                <!-- 用户信息显示 -->
                <div class="nav-user-wrapper pa" v-if="login">
                  <div class="nav-user-list">
                    <ul>
                      <!-- 头像 -->
                      <li class="nav-user-avatar">
                        <div>
                          <span class="avatar" :style="{ backgroundImage: 'url(' + userInfo.info.avatar + ')' }"></span>
                        </div>
                        <p class="name">{{ userInfo.info.username }}</p>
                      </li>
                      <li>
                        <router-link to="/user/orderCenter">我的订单</router-link>
                      </li>
                      <li>
                        <router-link to="/user/information">修改密码</router-link>
                      </li>
                      <li>
                        <router-link to="/user/addressList">收货地址</router-link>
                      </li>
                      <li>
                        <a href="javascript:;" @click="_logout">退出</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="shop pr" @mouseover="cartShowState(true)" @mouseout="cartShowState(false)" ref="positionMsg">
                <router-link to="/cart"></router-link>
                <span class="cart-num">
                  <i class="num" :class="{ no:totalNum <= 0, move_in_cart:receiveInCart }">{{ totalNum }}</i>
                </span>
                <!-- 购物车块显示 -->
                <div class="nav-user-wrapper pa active" v-show="showCart">
                  <div class="nav-user-list">
                    <div class="full" v-show="totalNum !== 0">
                      <!-- 购物列表 -->
                      <div class="nav-cart-items">
                        <ul>
                          <li class="clearfix" v-for="(item,i) in cartList" :key="i">
                            <div class="cart-item">
                              <div class="cart-item-inner">
                                <a @click="openProduct(item.itemId)">
                                  <div class="item-thumb">
                                    <img :src="item.picUrl">
                                  </div>
                                  <div class="item-desc">
                                    <div class="cart-cell"><h4>
                                      <a href="" v-text="item.title"></a>
                                    </h4>
                                      <h6><span class="price-icon">¥</span><span
                                        class="price-num">{{ item.price.toFixed(2) }}</span><span
                                        class="item-num">x {{ item.itemNum }}</span>
                                      </h6></div>
                                  </div>
                                </a>
                                <div class="del-btn del" @click="delGoods(item.itemId)">删除</div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!-- 总件数 -->
                      <div class="nav-cart-total">
                        <p>共计 <strong>{{ totalNum }} 件商品</strong></p>
                        <h5>合计：
                          <span class="price-icon">¥</span>
                          <span class="price-num">{{ totalPrice.toFixed(2) }}</span>
                        </h5>
                        <h6>
                          <y-button class-style="main-btn" style="height: 40px; width: 100%; margin: 0; color: #fff;font-size: 14px; line-height: 38px"
                            text="去购物车" @btnClick="toCart"></y-button>
                        </h6>
                      </div>
                    </div>
                    <div v-show="totalNum === 0" style="height: 313px;text-align: center" class="cart-con">
                      <p>您的购物车竟然是空的!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <slot name="nav">
        <div class="nav-sub" :class="{ fixed: st }">
          <div class="nav-sub-bg"></div>
          <div class="nav-sub-wrapper" :class="{ fixed: st }">
            <div class="w">
              <ul class="nav-list2">
                <li v-for="(nav, i) in navList" :key="i">
                    <a @click="changePage(i, nav.navUrl)" :class="{ active:i === choosePage }" >
                      {{ nav.navName }}
                    </a>
                </li>
              </ul>
              <div></div>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import YButton from '../components/YButton'
import { mapMutations, mapState } from 'vuex'
import { getStore, setStore } from '../utils/storage'
import { navList, delToken, getCartList, pushCartList, itemInfo, deleteCart } from '../api'

export default {
  components: {
    YButton
  },
  data: function () {
    return {
      user: {},
      // 查询数据库的商品
      st: false,
      // 头部购物车显示
      cartShow: false,
      positionL: 0,
      positionT: 0,
      timerCartShow: null, // 定时隐藏购物车
      input: '/',
      choosePage: 0,
      searchResults: [],
      timeout: null,
      token: '',
      navList: []
    }
  },
  computed: {
    ...mapState([
      'cartList', 'login', 'receiveInCart', 'showCart', 'userInfo'
    ]),
    // 计算价格
    totalPrice () {
      let totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        totalPrice += (item.itemNum * item.price)
      })
      return totalPrice
    },
    // 计算数量
    totalNum () {
      let totalNum = 0
      this.cartList && this.cartList.forEach(item => {
        totalNum += (item.itemNum)
      })
      return totalNum
    }
  },
  methods: {
    ...mapMutations(['ADD_CART', 'INIT_BUYCART', 'ADD_ANIMATION', 'SHOW_CART', 'REDUCE_CART', 'RECORD_USERINFO', 'EDIT_CART']),
    handleIconClick (ev) {
      if (this.$route.path === '/search') {
        this.$router.push({
          path: '/refreshSearch',
          query: {
            key: this.input
          }
        })
      } else {
        this.$router.push({
          path: '/search',
          query: {
            key: this.input
          }
        })
      }
    },
    showError (m) {
      this.$message.error({
        message: m
      })
    },
    // 导航栏文字样式改变
    changePage (v, item) {
      console.log(item)
      this.choosePage = v
      if (String(item).indexOf('/') === 0) {
        if (item === '/admin') {
          this.showError('oops... 后台项目还未开发完成，施主请耐心等待')
        } else {
          this.$router.push({
            path: item
          })
        }
      } else {
        window.open(item)
      }
    },
    // 搜索框提示
    handleSelect (item) {
      this.input = item.value
    },
    // 购物车显示
    cartShowState (state) {
      this.SHOW_CART({ showCart: state })
    },
    delGoods (itemId) {
      if (this.login) {
        let userId = getStore('userId')
        let params = {
          userId: userId,
          itemId: itemId
        }
        deleteCart(params).then(this.EDIT_CART({ itemId }))
      } else {
        this.EDIT_CART({ itemId })
      }
    },
    toCart () {
      this.$router.push({ path: '/cart' })
    },
    getPage () {
      let path = this.$route.path
      console.log(path)
      // let fullPath = this.$route.fullPath
      if (path === '/' || path === '/home') {
        this.changePage(0, path)
      } else if (path === '/goods') {
        this.changePage(1, path)
      }
    },
    openProduct (productId) {
      window.open('//' + window.location.host + '/#/goodsDetails?productId=' + productId)
    },
    // 控制顶部
    navFixed () {
      if (this.$route.path === '/goods' || this.$route.path === '/home' || this.$route.path === '/goodsDetail' || this.$route.path === '/thanks') {
        let st = document.documentElement.scrollTop || document.body.scrollTop
        st >= 100 ? this.st = true : this.st = false
        // 计算小圆当前位置
        let num = document.querySelector('.num')
        this.positionL = num.getBoundingClientRect().left
        this.positionT = num.getBoundingClientRect().top
        this.ADD_ANIMATION({ cartPositionL: this.positionL, cartPositionT: this.positionT })
      } else {

      }
    },
    // 导航栏
    _getNavList () {
      navList().then(res => {
        this.navList = res
      })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    // 退出登录
    async _logout () {
      await setStore('token', '')
      let data = {
        'token': this.token
      }
      let res = await delToken(data)
      if (res.code === 40008) {
        this.$message.success({
          message: '退出成功'
          // ,onClose: this.$router.go({path: '/home'})
        })
        this.sleep(1500).then(() => {
          this.$router.push({path: '/home'})
        })
      } else {
        this.$message.error('退出失败，请稍后重试')
      }
    },
    async _getCartList () {
      let userId = getStore('userId')
      let result = await getCartList(userId)
      result = result.result
      console.log(result)
      let cartList = []
      for (let i in result) {
        let res = await itemInfo(result[i].itemId)
        let param = {
          itemId: result[i].itemId,
          price: res.result.price,
          itemNum: result[i].number,
          title: res.result.title,
          picUrl: res.result.picUrl,
          checked: '1',
          isOnline: true
        }
        cartList.push(param)
      }
      console.log(cartList)
      setStore('buyCart', cartList)
      this.INIT_BUYCART()
    },
    async _pushCartList () {
      let userId = getStore('userId')
      let localCartList = getStore('buyCart')
      localCartList = JSON.parse(localCartList)
      let pushList = []
      for (let i in localCartList) {
        console.log(localCartList[i])
        if (localCartList[i].isOnline) {
          continue
        }
        let param = {
          userId: userId,
          itemId: localCartList[i].itemId,
          number: localCartList[i].itemNum,
          status: 1
        }
        pushList.push(param)
      }
      console.log(pushList)
      await pushCartList(pushList).then(res => {
        if (res.code === 20001) {
          console.log('cart add success')
        } else {
          console.error('cart add failed')
        }
      }).then(this._getCartList)
    }
  },
  mounted () {
    this._getNavList()
    this.token = getStore('token')
    if (this.login) {
      // 登录态首先同步本地购物车信息
      this._pushCartList()
      // this._getCartList()
    } else {
      this.INIT_BUYCART()
    }
    this.navFixed()
    this.getPage()
    window.addEventListener('scroll', this.navFixed)
    window.addEventListener('resize', this.navFixed)
    // eslint-disable-next-line
    if (typeof (this.$route.query.key) !== undefined) {
      this.input = this.$route.query.key
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/theme";
  @import "../assets/style/mixin";
  @import "../style/header";
</style>
