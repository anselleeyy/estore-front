<template>
  <div class="checkout">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w" style="padding-top: 40px;">
      <!-- 收货地址 -->
      <y-shelf title="收货信息">
        <div slot="content">
          <ul class="address-item-list clearfix">
            <li v-for="(item,i) in addList"
                :key="i"
                class="address pr"
                :class="{checked:msg.addressId === item.id}"
                @click="chooseAddress(item.id, item.passName, item.tel, item.address)">
           <span v-if="msg.addressId === item.id" class="pa">
             <svg viewBox="0 0 1473 1024" width="17.34375" height="12">
             <path
               d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
               fill="#6A8FE5" p-id="1025">
               </path>
             </svg>
             </span>
              <p>收货人: {{ item.passName }} {{ item.isDefault ? '(默认地址)' : '' }}</p>
              <p class="street-name ellipsis">收货地址: {{ item.address }}</p>
              <p>手机号码: {{item.tel}}</p>
<!--              <div class="operation-section">-->
<!--                <span class="update-btn" style="font-size:12px" @click="update(item)">修改</span>-->
<!--                <span class="delete-btn" style="font-size:12px" :data-id="item.addressId" @click="del(item.addressId)">删除</span>-->
<!--              </div>-->
            </li>
          </ul>
        </div>
      </y-shelf>
      <!-- 购物清单 -->
      <y-shelf title="购物清单">
        <div slot="content">
          <div class="box-inner ui-cart">
            <div>
              <!--标题-->
              <div class="cart-table-title">
                <span class="name">商品信息</span>
                <span class="subtotal">小计</span>
                <span class="num">数量</span>
                <span class="price">单价</span>
              </div>
              <!--列表-->
              <div class="cart-table" v-for="(item,i) in cartList" :key="i">
                <div class="cart-group divide pr" :data-productid="item.itemId">
                  <div class="cart-top-items">
                    <div class="cart-items clearfix">
                      <!--图片-->
                      <div class="items-thumb fl">
                        <img :alt="item.title"
                             :src="item.picUrl">
                        <a @click="goodsDetails(item.itemId)" :title="item.title" target="_blank"></a>
                      </div>
                      <!--信息-->
                      <div class="name hide-row fl">
                        <div class="name-table">
                          <a @click="goodsDetails(item.itemId)" :title="item.title" target="_blank"
                             v-text="item.title"></a>
                          <!-- <ul class="attribute">
                            <li>白色</li>
                          </ul> -->
                        </div>
                      </div>
                      <!--商品数量-->
                      <div>
                        <!--总价格-->
                        <div class="subtotal" style="font-size: 14px">¥ {{item.price * item.itemNum}}</div>
                        <!--数量-->
                        <div class="item-cols-num">
                          <span v-text="item.itemNum"></span>
                        </div>
                        <!--价格-->
                        <div class="price">¥ {{item.price}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 合计 -->
            <div class="cart-bottom-bg fix-bottom">
              <div class="fix-bottom-inner">
                <div class="shipping">
                  <div class="shipping-box" style="padding: 0 40px;">
                    <div class="shipping-total shipping-price"><h4
                      class="highlight">应付总额：<em>￥{{checkPrice}}</em>
                    </h4>
                    </div>
                  </div>
                  <y-button class="big-main-btn"
                            :classStyle="submit?'disabled-btn':'main-btn'"
                            style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                            :text="submitOrder"
                            @btnClick="_submitOrder"
                            >
                  </y-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </y-shelf>
    </div>
    <y-footer></y-footer>
  </div>
</template>

<script>
import YHeader from '../../common/header'
import YFooter from '../../common/footer'
import YButton from '../../components/YButton'
import YPopup from '../../components/popup'
import YShelf from '../../components/shelf'
import { getStore } from '../../utils/storage'
import { getCartList, getAllAddress, createOrder } from '../../api'

export default {
  name: 'checkout',
  data () {
    return {
      cartList: [],
      addList: [],
      addressId: '0',
      popupOpen: false,
      popupTitle: '管理收货地址',
      num: '', // 立刻购买
      productId: '',
      msg: {
        addressId: '',
        userName: '',
        tel: '',
        streetName: '',
        isDefault: false
      },
      userName: '',
      tel: '',
      streetName: '',
      userId: '',
      orderTotal: 0,
      submit: false,
      submitOrder: '提交订单'
    }
  },
  computed: {
    checkPrice () {
      let totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        if (item.checked === '1') {
          totalPrice += (item.itemNum * item.price)
        }
      })
      // eslint-disable-next-line
      this.orderTotal = totalPrice
      return totalPrice
    }
  },
  methods: {
    message (m) {
      this.$message({
        message: m,
        type: 'error'
      })
    },
    // 选择地址
    chooseAddress (addressId, userName, tel, streetName) {
      this.msg.addressId = addressId
      this.msg.userName = userName
      this.msg.tel = tel
      this.msg.streetName = streetName
    },
    async _addressList () {
      await getAllAddress(this.userId).then(res => {
        let data = res.result
        if (data.length) {
          this.addList = data
          this.msg.addressId = data[0].id || '1'
          this.msg.userName = data[0].passName
          this.msg.tel = data[0].tel
          this.msg.streetName = data[0].address
          this.msg.isDefault = data[0].isDefault === 1
        } else {
          this.addList = []
        }
      })
    },
    async _submitOrder () {
      this.submit = true
      let details = []
      for (let i in this.cartList) {
        let item = this.cartList[i]
        let detail = {
          itemId: item.itemId,
          num: item.itemNum,
          picUrl: item.picUrl,
          price: item.price,
          title: item.title,
          totalFee: item.price * item.itemNum
        }
        details.push(detail)
      }
      let param = {
        payment: this.checkPrice,
        userId: this.userId,
        addressId: this.msg.addressId,
        details: details
      }
      await createOrder(param).then(res => {
        if (res.code === 70001) {
          this.$message.success('订单提交成功')
          this.$router.push('/user/orderCenter')
        } else {
          this.$message.error('订单提交失败')
        }
      })
    },
    // 付款
    payment (orderId) {
      // 需要拿到地址id
      this.$router.push({
        path: '/order/payment',
        query: {
          'orderId': orderId
        }
      })
    },
    _getCartList () {
      getCartList(this.userId).then(res => {
        this.cartList = res
      })
    }
  },
  created () {
    this.userId = getStore('userId')
    this.cartList = JSON.parse(getStore('buyCart'))
    this._addressList()
  },
  components: {
    YHeader,
    YFooter,
    YButton,
    YPopup,
    YShelf
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // 收货地址
  .address-item-list {
    padding: 30px 13px 0;
    .address {
      padding: 19px 14px 0 19px;
      p {
        line-height: 26px;
      }
    }
    li.checked {
      border-color: #6A8FE5;
      position: relative;
      background: #fff;
      .pa {
        right: 15px;
        top: 18px;
      }
      &:hover {
        background: #fff;
      }
    }
    li {
      position: relative;
      overflow: hidden;
      float: left;
      width: 276px;
      height: 158px;
      margin: 0 0 30px 16px;
      border: 1px solid #E5E5E5;
      border-radius: 3px;
      background: #FAFAFA;
      line-height: 14px;
      text-align: left;
      word-wrap: break-word;
      word-break: normal;
      color: #626262;
      cursor: pointer;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -o-user-select: none;
      user-select: none;
      &:hover {
        background: #F2F2F2;
        .operation-section {
          visibility: visible;
          transform: translate(0, 0);
        }
      }
      &.add-address-item {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        p {
          margin-top: 5px;
        }
      }
      .operation-section {
        visibility: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 28px;
        background: #E1E1E1;
        border-top: 1px solid #E1E1E1;
        transition: all .2s ease;
        transform: translate(0, 29px);
        border-top: 1px solid #E1E1E1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 11;
        span {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          &:hover {
            background: #F2F2F2;
          }
        }

        span + span {
          border-left: 1px solid #E1E1E1;
        }

      }
    }
  }

  .s-content {
    .md {
      > div {
        text-align: left;
        margin-bottom: 15px;
        > input {
          width: 100%;
          height: 50px;
          font-size: 18px;
          padding: 10px 20px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
          line-height: 46px;
        }
      }
    }

    .btn {
      margin: 0;
      width: 100%;
      height: 50px;
      font-size: 14px;
      line-height: 48px
    }
  }

  .ui-cart {
    img {
      width: 80px;
      height: 80px;
    }

    .cart-table-title {
      position: relative;
      z-index: 1;
      line-height: 38px;
      height: 38px;
      padding: 0 0 0 30px;
      font-size: 12px;
      background: #eee;
      border-bottom: 1px solid #dbdbdb;
      border-bottom-color: rgba(0, 0, 0, .08);
      .name {
        float: left;
        text-align: left;
      }
      span {
        width: 137px;
        float: right;
        text-align: center;
        color: #838383;
      }
    }
    .cart-group.divide {
      .cart-items {
        border-top: 1px dashed #eee;
      }
    }
    .cart-items {
      position: relative;
      height: 140px;
      margin-left: 74px;
      .subtotal {
        font-weight: 700;
      }
      .item-cols-num,
      .price,
      .subtotal {
        overflow: hidden;
        float: right;
        width: 137px;
        text-align: center;
        color: #666;
        line-height: 140px;
      }
      /*数量*/
      .subtotal,
      .item-cols-num {
        padding-top: 50px;
        line-height: 40px;
      }
      .select {
        width: 112px;
        height: 40px;
        padding-top: 4px;
        margin: 0 auto;
        line-height: 40px;
        .down {
          background-position: 0 -60px;
        }
        .down.down-disabled:hover {
          background-position: 0 -300px;
          cursor: not-allowed;
        }
        .num {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 36px;
          height: 18px;
          margin: 7px 0 0;
          border: none;
          border-radius: 3px;
          line-height: 18px;
          text-align: center;
          font-size: 14px;
          transition: all .2s ease-out;
        }
      }

    }
    .down.down-disabled {
      background-position: 0 -300px;
      cursor: not-allowed;
    }
  }

  .cart-group.divide .cart-top-items:first-child .cart-items {
    border-top: none;
  }

  .items-choose {
    position: absolute;
    left: -74px;
    top: 0;
    width: 74px;
    height: 20px;
    padding: 60px 0 0 31px;
    font-size: 12px;
    color: #999;
  }

  .items-thumb {
    position: relative;
    margin-top: 30px;
    overflow: hidden;
    width: 80px;
    height: 80px;
    img {
      width: 80px;
      height: 63px;
      margin-top: 8px;
    }
  }

  .cart-items .items-thumb > a, .ui-cart .cart-items .items-thumb > i {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid #fff;
    border-radius: 3px;
    border: 0 solid rgba(255, 255, 255, .1);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  }

  .name {
    width: 380px;
    margin-left: 20px;
    color: #323232;
    display: table;
    a {
      color: #333;
      font-size: 16px;
    }
  }

  .name-table {
    display: table-cell;
    vertical-align: middle;
    height: 140px;
  }

  .fix-bottom {
    padding: 22px 29px 19px 30px;
    height: 90px;
    width: 100%;
    z-index: 1;
    background-position: center;
    background: #fdfdfd;
    background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
    background: linear-gradient(#fdfdfd, #f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
    .cart-bottom-bg {
      height: 80px;
      border-top: 1px solid #D9D9D9;
      border-radius: 0 0 8px 8px;
    }
    .fix-bottom-inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .shipping {
      display: flex;
      align-items: center;
    }
    em {
      display: inline-block;
      position: relative;
      top: 3px;
      margin-top: -4px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
    }
  }

  .attribute, .name p {
    color: #999;
    font-size: 12px;
    padding-top: 4px;
    line-height: 17px;
  }

</style>
