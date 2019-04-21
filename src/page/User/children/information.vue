<template>
  <div>
    <y-shelf title="修改密码">
      <div slot="content">
        <div class="avatar-box">
          <!--<div class=img-box><img :src="userInfo.info.avatar" alt=""></div>-->
          <!--<div class="r-box">-->
            <!--<h3 style="margin-left: 13px;">修改密码</h3>-->
            <!--&lt;!&ndash;<y-button text="上传头像" classStyle="main-btn" style="margin: 0;" @btnClick="editAvatar()"></y-button>&ndash;&gt;-->
          <!--</div>-->
        </div>
        <el-form :model="updateForm" :rules="rules" label-width="80px" ref="updateForm" style="width: 350px; margin-left: 30px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="updateForm.oldPassword" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" placeholder="请输入新密码" v-model="updateForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item prop="repeat" label="再次输入">
            <el-input type="password" placeholder="请再次输入新密码" v-model="updateForm.repeat"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="update()" class="submit_btn">{{ updateTxt }}</el-button>
            <el-button type="warning" plain class="submit_btn">重置</el-button>
            <br>
          </el-form-item>
        </el-form>
      </div>
    </y-shelf>
  </div>
</template>

<script>
import YShelf from '../../../components/shelf'
import YButton from '../../../components/YButton'
import vueCropper from 'vue-cropper'
import { getStore } from '../../../utils/storage'
import { mapState, mapMutations } from 'vuex'
import { updatePwd } from '../../../api'

export default {
  name: 'information',
  data () {
    return {
      imgSrc: '',
      editAvatarShow: false,
      cropContext: '',
      cropperImg: '',
      previews: {},
      option: {
        img: '',
        zoom: 0
      },
      fixedNumber: [1, 1],
      example2: {
        info: true,
        size: 1,
        canScale: false,
        autoCrop: true,
        outPutType: 'image/png',
        canMove: false,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 300,
        autoCropHeight: 250,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [ 1, 1 ]
      },
      userId: '',
      token: '',
      updateTxt: '立即修改',
      // 上传图片
      imageUrl: 'http://10.11.124.102/mall/userInfo/avatar/admin/339a8f652dae8d85afdcbd6d369f4d2a.jpeg',
      updateForm: {
        oldPassword: '',
        newPassword: '',
        repeat: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        repeat: [
          { required: true, message: '请再次密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState([ 'userInfo' ])
  },
  methods: {
    ...mapMutations([ 'RECORD_USERINFO' ]),
    message (m) {
      this.$message(m)
    },
    messageSuccess (m) {
      this.$message({
        message: m,
        type: 'success'
      })
    },
    messageFail (m) {
      this.$message({
        message: m,
        type: 'error'
      })
    },
    update () {
      this.updateTxt = '修改中'
      let oldPassword = this.updateForm.oldPassword
      let newPassword = this.updateForm.newPassword
      let repeat = this.updateForm.repeat
      if (newPassword !== repeat) {
        this.messageFail('二次密码不正确，请重新输入')
        this.$refs['updateForm'].resetFields()
      }
      let params = {
        oldPassword: oldPassword,
        newPassword: newPassword
      }
      updatePwd(this.userId, params).then(res => {
        if (res.code === 40006) {
          this.messageSuccess(res.message)
        } else {
          this.messageFail(res.message)
        }
        this.updateTxt = '立即修改'
        this.$refs['updateForm'].resetFields()
      })
    },
    editAvatar () {
      this.editAvatarShow = true
    },
    uploadImg (e) {
      let file = e.target.files[0]
      if (file.size > 2097152) {
        this.messageFail('图片大小不得超过2Mb')
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.messageFail('图片类型仅支持 .gif, .jpeg, .jpg, .png, .bmp 格式')
        return false
      }
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.option.img = e.target.result
      }
    },
    realTime (data) {
      this.previews = data
      let w = 100 / data.w
      this.option.zoom = w
    }
  },
  created () {
    this.token = getStore('token')
    this.userId = getStore('userId')
  },
  components: {
    YShelf,
    YButton,
    vueCropper
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .avatar-box {
    height: 5px;
    display: flex;
    margin: 0 30px 30px;
    /*border-bottom: #dadada solid 1px;*/
    line-height: 30px;
    display: flex;
    align-items: center;
    .img-box {
      @include wh(80px);
      border-radius: 5px;
      overflow: hidden;
    }
    img {
      display: block;
      @include wh(100%)
    }
    .r-box {
      margin-left: 20px;
      h3 {
        font-size: 18px;
        font-weight: 400;
        color: #333;
      }
    }
  }

  // 修改头像
  .edit-avatar {
    z-index: 9999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include wh(100%);
    background-color: rgba(0, 0, 0, .5);
    @extend %block-center;
    .content {
      display: flex;
      padding: 45px 100px 0;
    }
    > div {
      box-sizing: content-box;
      @include wh(700px, 500px);
      margin: 0;
    }
    .btn {
      width: 80px;
      height: 30px;
      margin-left: 10px;
      position: relative;
      text-align: center;
      line-height: 30px;
      text-shadow: rgba(255, 255, 255, .496094) 0 1px 0;
      border: 1px solid #E6E6E6;
      border-radius: 10px;
      &:hover {
      }
      a {
        color: #666;
        display: block;
        @include wh(100%);
      }
    }
    input[type=file] {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      opacity: 0;
      width: 80px;
      height: 30px;
      cursor: pointer;
      box-sizing: border-box;
      border: 15px solid #000;
      overflow: hidden;
    }
    .edit-l {
      width: 100px;
      text-align: center;
    }
    .edit-r {
      margin-left: 20px;
      flex: 1;
      > div {
        border: 1px solid #ccc;
        width: 320px;
        height: 320px;
      }
    }
  }

  .image-container {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    padding: 0 10px;
    @extend %block-center;
    &:hover {
      svg {
        transition: all 1s;
        transform: rotate(360deg);
        transform-origin: 50% 50%;
      }
      path {
        fill: #8a8a8a;
      }
    }
  }

  .big {
    display: block;
    width: 320px;
    height: 320px;
  }
  .bottom-btn {
    padding: 0 15px;
    border-top: 1px solid #E6E6E6;
    bottom: 0;
    height: 60px;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
