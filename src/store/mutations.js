import {
  EDIT_CART,
  INIT_BUYCART,
  SHOW_CART,
  RECORD_USERINFO,
  ADD_ANIMATION,
  GET_USERINFO,
  ADD_CART,
  REDUCE_CART
} from './mutation-types'

import { getStore, setStore } from '../utils/storage'

export default {
  [ADD_CART] (state, { itemId, price, title, picUrl, itemNum = 1 }) {
    let cart = state.cartList
    let flag = true
    let goods = {
      itemId,
      price,
      title,
      picUrl
    }
    if (cart.length) {
      cart.forEach(item => {
        if (item.itemId === itemId) {
          if (item.itemNum >= 0) {
            flag = false
            item.itemNum += itemNum
          }
        }
      })
    }
    if (!cart.length || flag) {
      goods.itemNum = itemNum
      goods.checked = '1'
      cart.push(goods)
    }
    state.cartList = cart
    setStore('buyCart', cart)
  },
  // 从购物车移除商品
  [REDUCE_CART] (state, { itemId }) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.itemId === itemId) {
        if (item.itemNum > 1) {
          item.itemNum--
        } else {
          cart.splice(i, 1)
        }
      }
    })
  },
  // 修改购物车
  [EDIT_CART] (state, { itemId, itemNum, checked }) {
    let cart = state.cartList
    if (itemNum) {
      cart.forEach((item, i) => {
        if (item.itemId === itemId) {
          item.itemNum = itemNum
          item.checked = checked
        }
      })
    } else if (itemId) {
      cart.forEach((item, i) => {
        if (item.itemId === itemId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item, i) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
    setStore('buyCart', state.cartList)
  },
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  [SHOW_CART] (state, { showCart }) {
    state.showCart = showCart
  },
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('userInfo', info)
  },
  // 加入购物车动画
  [ADD_ANIMATION] (state, { moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart }) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionL = cartPositionL
      state.cartPositionT = cartPositionT
    }
  },
  // 获取用户信息
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = { ...info }
    } else {
      state.userInfo = null
    }
  }
}
