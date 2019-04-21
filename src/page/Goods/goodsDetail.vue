<!-- 商品详情页 -->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(loop, i) in small" :key="i" :class="{ on:big === loop }" @click="big = loop">
                <img v-lazy="loop" :alt="item.title">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="item.title">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{ item.title }}</h4>
          <h6>
            <span>{{ item.author }}</span>
            <span class="price">
              <em>¥</em><i>{{ item.price.toFixed(2) }}</i>
            </span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :limit="Number(item.itemDetail.limitNum)"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(item.id, item.price, item.title, item.picUrl)"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="规格参数">
        <div slot="content">
          <div class="detail">
            <ul>
              <li>ISBN： {{ item.id }}</li>
              <li>书名： {{ item.title }}</li>
              <li>作者： {{ item.author }}</li>
              <li>出版社： {{ item.publisher }}</li>
              <li>价格： ￥ {{ item.price }}</li>
              <li>版次： {{ item.itemDetail.version }}</li>
              <li>出版日期： {{ item.itemDetail.publishDate }}</li>
              <li>页数： {{ item.itemDetail.pageNum }}</li>
              <li>包装： {{ item.itemDetail.packStyle }}</li>
            </ul>
          </div>
        </div>
      </y-shelf>
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg">{{ productMsg }}</div>
          </div>
          <div class="no-info" v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import YButton from '../../components/YButton'
import YShelf from '../../components/shelf'
import BuyNum from '../../components/buynum'
import { getStore } from '../../utils/storage'
import { itemInfo, addCart } from '../../api'

export default {
  name: 'goodsDetail',
  data () {
    return {
      productMsg: '',
      small: [],
      big: '',
      item: {},
      userId: ''
    }
  },
  computed: {
    ...mapState([ 'login', 'showMoveImg', 'showCart' ])
  },
  methods: {
    ...mapMutations([ 'ADD_CART', 'ADD_ANIMATION' ]),
    _itemInfo (itemId) {
      itemInfo(itemId).then(res => {
        let result = res
        console.log('info: ' + result)
        this.item = result
        this.small = result.itemDetail.smallPicList
        this.big = this.small[0]
        this.productMsg = result.itemDetail.detailPicUrl
        console.log('small: ' + this.small)
      })
    },
    editNum (num) {
      this.productNum = num
    },
    addCart (id, price, name, img) {
      if (!this.showMoveImg) {
        if (this.login) { // 登录了 直接存在用户名下
          addCart(
            {
              userId: parseInt(getStore('userId')),
              itemId: id,
              number: 1
            }).then(res => {
            // 并不重新请求数据
            this.ADD_CART({itemId: id, price: price, title: name, picUrl: img})
          })
        } else { // 未登录 vuex
          this.ADD_CART({itemId: id, price: price, title: name, picUrl: img})
        }
        // 加入购物车动画x`
        let dom = event.target
        // 获取点击的坐标
        let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
        let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
        // 需要触发
        this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
        if (!this.showCart) {
          this.SHOW_CART({showCart: true})
        }
      }
    }
  },
  components: {
    YButton,
    YShelf,
    BuyNum
  },
  created () {
    let id = this.$route.query.itemId
    this.userId = getStore('userId')
    this._itemInfo(id)
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../style/Goods/goodsDetail";
  .detail {
    font-family: "Adobe 楷体 Std R";
    margin: 15px auto 0 auto;
    width: 1200px;
    li {
      padding-left: 20px;
      width: 25%;
      overflow: hidden;
      float: left;
      line-height: 22px;
      height: 35px;
      color: #323232;
    }
  }
</style>
