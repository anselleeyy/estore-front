<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div v-loading="loading" element-loading-text="加载中..." v-if="orderList.length" style="min-height: 10vw;">
          <div v-for="(item, i) in orderList" :key="i">
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date">{{dateFormat(item.createTime)}}</span>
                  <span class="order-id"> 订单号： <a @click="orderDetail(item.orderId)">{{ item.orderId }}</a> </span>
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="operation">商品操作</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">实付金额</span>
                <span class="order-detail"> <a @click="orderDetail(item.orderId)">查看详情 ><em class="icon-font"></em></a> </span>
              </div>
            </div>
            <div class="pr">
              <div class="cart" v-for="(good, j) in item.details" :key="j">
                <div class="cart-l" :class="{bt:j>0}">
                  <div class="car-l-l">
                    <div class="img-box"><a @click="goodsDetails(good.itemId)"><img :src="good.picUrl" alt=""></a></div>
                    <div class="ellipsis"><a style="color: #626262;" @click="goodsDetails(good.itemId)">{{ good.title }}</a></div>
                  </div>
                  <div class="cart-l-r">
                    <div>¥ {{ Number(good.price).toFixed(2) }}</div>
                    <div class="num">{{ good.num }}</div>
                    <div class="type">
                      <el-button style="margin-left:20px"  type="danger" size="small" v-if="j<1" class="del-order">删除此订单</el-button>
                      <!--@click="_delOrder(item.orderId,i)"-->
                    </div>
                  </div>
                </div>
                <div class="cart-r">
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="prod-operation pa" style="right: 0;top: 0;">
                <div class="total">¥ {{ item.payment }}</div>
                <div v-if="item.status === 0">
                  <el-button disabled @click="orderPayment(item.orderId)" type="primary" size="small">现在付款</el-button>
                </div>
                <div class="status" v-if="item.status !== 0"> {{ getOrderStatus(item.orderStatus) }}  </div>
              </div>
            </div>
          </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中..." class="no-info" v-else>
          <div style="padding: 100px 0;text-align: center">
            你还未创建过订单
          </div>
        </div>
      </div>
    </y-shelf>
    <div style="float:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import YShelf from '../../../components/shelf'
import { getStore } from '../../../utils/storage'
import { getOrders } from '../../../api'

export default {
  name: 'order',
  data () {
    return {
      testList: [],
      orderList: [],
      userId: '',
      orderStatus: '1',
      loading: true,
      currentPage: 1,
      pageSize: 5,
      total: 0
    }
  },
  methods: {
    dateFormat (time) {
      console.log(time)
      let date = new Date(time)
      date = new Date(date - 13 * 60 * 60 * 1000)
      console.log(date)
      return date.toLocaleString()
    },
    message (m) {
      this.$message({
        message: m,
        type: 'error'
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      // this._getOrderList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this._getOrderList()
    },
    orderPayment (orderId) {
      window.open(window.location.origin + '#/order/payment?orderId=' + orderId)
    },
    goodsDetails (id) {
      window.open(window.location.origin + '#/goodsDetails?productId=' + id)
    },
    orderDetail (orderId) {
      this.$router.push({
        path: 'orderDetail',
        query: {
          orderId: orderId
        }
      })
    },
    getOrderStatus (status) {
      if (status === '1') {
        return '支付审核中'
      } else if (status === '2') {
        return '待发货'
      } else if (status === '3') {
        return '待收货'
      } else if (status === '4') {
        return '交易成功'
      } else if (status === '5') {
        return '交易关闭'
      } else if (status === '6') {
        return '支付失败'
      }
    },
    async _getOrderList () {
      this.loading = true
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.orderList = await getOrders(this.userId, params).then(res => {
        this.total = res.result.total
        return res.result.list
      })
      this.loading = false
    }
  },
  created () {
    this.userId = getStore('userId')
    this._getOrderList()
  },
  components: {
    YShelf
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        > span {
          width: 112px;
          text-align: center;
        }
      }
    }
    .last {
      width: 230px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 0px;
  }

  .order-id {
    margin-left: 25px;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }
    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      justify-content: space-between;
      position: relative;
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
        @include wh(80px);
      }
      img {
        display: block;
        margin-top: 8px;
        @include wh(80px, 63px);
      }
      .cart-l-r {
        display: flex;
        > div {
          text-align: center;
          width: 112px;
        }
      }
      .car-l-l {
        display: flex;
        align-items: center;
      }
    }
    .cart-r {
      width: 230px;
      display: flex;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }

  .prod-operation {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 254px;
    div {
      width: 100%;
      text-align: center;
    }
    div:last-child {
      padding-right: 24px;
    }
  }
  .pa {
    position: absolute;
  }
</style>
