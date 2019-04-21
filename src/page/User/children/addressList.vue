<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right"><y-button text="添加收货地址" style="margin: 0" @btnClick="update()"></y-button></span>
      <div slot="content">
        <!--标题-->
        <div class="table-title">
          <span class="name">姓名</span> <span class="address">详细地址</span> <span class="tel">电话</span>
        </div>
        <div v-if="addList.length">
          <div class="address-item" v-for="(item,i) in addList" :key="i">
            <div class="name">{{ item.userName }}</div>
            <div class="address-msg">{{ item.address }}</div>
            <div class="telephone">{{ item.tel }}</div>
            <div class="defalut">
              <a @click="changeDef(item)"
                 href="javascript:;"
                 v-text="item.isDefault ? '默认地址' : '设为默认'"
                 :class="{ 'default-address': item.isDefault }"></a>
            </div>
            <div class="operation">
              <el-tooltip effect="dark" content="修改" placement="top-end">
                <el-button type="primary" icon="el-icon-edit" size="small"  @click="update(item)" circle></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <el-button type="danger" icon="el-icon-delete" size="small" :data-id="item.addressId" @click="del(item.addressId,i)" circle></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
          </div>
        </div>
      </div>
    </y-shelf>
    <y-popup :open="popupOpen" @close='popupOpen = false' :title="popupTitle">
      <div slot="content" class="md" :data-id="msg.addressId">
        <div>
          <!--<input type="text" placeholder="收货人姓名" v-model="msg.userName">-->
          <el-input placeholder="收货人姓名" v-model="msg.userName" clearable></el-input>
        </div>
        <div>
          <!--<input type="number" placeholder="手机号码" v-model="msg.tel">-->
          <el-input placeholder="收货人联系号码" v-model="msg.tel" clearable></el-input>
        </div>
        <div>
          <!--<input type="text" placeholder="收货地址" v-model="msg.streetName">-->
          <el-input placeholder="收货地址" v-model="msg.address" clearable></el-input>
        </div>
        <div>
          <el-checkbox class="auto-login" v-model="msg.isDefault">设为默认</el-checkbox>
        </div>
        <y-button text='保存'
                  class="btn"
                  :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                  @btnClick="
                  save(
                    {
                      userId: userId,
                      addressId: msg.addressId,
                      userName: msg.userName,
                      tel: msg.tel,
                      address: msg.address,
                      isDefault: msg.isDefault
                     })">
        </y-button>
      </div>
    </y-popup>
  </div>
</template>

<script>
import YButton from '../../../components/YButton'
import YShelf from '../../../components/shelf'
import YPopup from '../../../components/popup'
import { getStore } from '../../../utils/storage'

export default {
  name: 'addressList',
  data () {
    return {
      addList: [
        {
          addressId: 486,
          isDefault: true,
          address: '江苏省南京市江宁区弘景大道3601号',
          tel: '13877776666',
          userId: 2,
          userName: 'ping-pong'
        },
        {
          addressId: 488,
          isDefault: false,
          address: '江苏省南京市雨花台区铁心桥街道软件谷科创城 C2 14楼',
          tel: '13877776666',
          userId: 2,
          userName: '李先生'
        }
      ],
      popupOpen: false,
      popupTitle: '管理收货地址',
      msg: {
        addressId: '',
        userName: '',
        tel: '',
        address: '',
        isDefault: false
      },
      userId: '',
      isDisabled: false
    }
  },
  computed: {
    btnHighlight () {
      let msg = this.msg
      return msg.userName && msg.tel && msg.address
    }
  },
  methods: {
    message (m) {
      this.$message.error({
        message: m
      })
    },
    // 保存一个新地址
    save (p) {
      this.popupOpen = false
      console.log(JSON.stringify(p))
    },
    // 修改或新增
    update (item) {
      this.popupOpen = true
      if (item) {
        this.popupTitle = '管理收货地址'
        this.msg.userName = item.userName
        this.msg.tel = item.tel
        this.msg.address = item.address
        this.msg.isDefault = item.isDefault
        this.msg.addressId = item.addressId
      } else {
        this.popupTitle = '新增收货地址'
        this.msg.userName = ''
        this.msg.tel = ''
        this.msg.address = ''
        this.msg.isDefault = false
        this.msg.addressId = ''
      }
    }
  },
  created () {
    this.userId = getStore('userId')
    // this._addressList()
  },
  components: {
    YButton,
    YShelf,
    YPopup
  }
}
</script>

<style scoped lang="scss">
  .table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 38px;
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
      float: left;
      text-align: center;
      color: #838383;
    }
    .address {
      margin-left: 115px;
    }
    .tel {
      margin-left: 195px;
    }
  }

  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .default-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
    font-weight: bolder;
  }

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
    height: 40px;
    font-size: 14px;
    line-height: 36px
  }
</style>
