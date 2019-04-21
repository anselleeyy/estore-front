<template>
  <div class="home">
    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35px;" v-if="!error">
      <div class="banner">
        <div class="bg" ref="bg">
          <transition name="fade">
            <div v-for="(item, i) in banner" v-if="i === mark" :key="i" style="position:absolute" @click="linkTo(item)" @mouseover="stopTimer" @mouseout="startTimer">
              <img v-if="item.imgUrl" class="img1" :src="item.imgUrl"/>
            </div>
          </transition>
        </div>
        <div class="page">
          <ul class="dots">
            <li class="dot-active" v-for="(item, i) in banner" :class="{ 'dot':i !== mark }" :key="i" @click="change(i)"></li>
          </ul>
        </div>
      </div>
      <section class="w mt30 clearfix">
        <y-shelf :title="title">
          <div slot="content" class="floors">
            <mall-goods :msg="item" v-for="(item, j) in home" :key="j"></mall-goods>
          </div>
        </y-shelf>
      </section>
    </div>
  </div>
</template>

<script>
import YShelf from '../../components/shelf'
import mallGoods from '../../components/mallGoods'
import { homeBanner, homeItem } from '../../api/index'

export default {
  data () {
    return {
      error: false,
      banner: [],
      mark: 0,
      bgOpt: { px: 0, py: 0, w: 0, h: 0 },
      home: [],
      loading: true,
      notify: '1',
      dialogVisible: false,
      timer: '',
      title: '熱搜圖書'
    }
  },
  mounted () {
    homeBanner().then(res => {
      if (res.success === false) {
        this.error = true
        return
      }
      this.banner = res
      this.loading = false
    })
    homeItem().then(res => {
      if (res.success === false) {
        this.error = true
        return
      }
      this.home = res
    })
  },
  created () {
    this.play()
  },
  methods: {
    autoPlay () {
      this.mark++
      if (this.mark > this.banner.length - 1) {
        // 当遍历到最后一张图片置零
        this.mark = 0
      }
    },
    play () {
      // 每2.5s自动切换
      this.timer = setInterval(this.autoPlay, 2500)
    },
    change (i) {
      this.mark = i
    },
    startTimer () {
      this.timer = setInterval(this.autoPlay, 2500)
    },
    stopTimer () {
      clearInterval(this.timer)
    },
    linkTo (item) {
      if (item.type === 0 || item.type === 2) {
        // 关联商品
        this.$router.push({
          path: '/goodsDetails',
          query: {
            productId: item.productId
          }
        })
      } else {
        // 完整链接
        window.location.href = item.fullUrl
      }
    },
    bgOver (e) {
      this.bgOpt.px = e.offsetLeft
      this.bgOpt.py = e.offsetTop
      this.bgOpt.w = e.offsetWidth
      this.bgOpt.h = e.offsetHeight
    },
    bgMove (dom, eve) {
      let bgOpt = this.bgOpt
      let X, Y
      let mouseX = eve.pageX - bgOpt.px
      let mouseY = eve.pageY - bgOpt.py
      if (mouseX > bgOpt.w / 2) {
        X = mouseX - (bgOpt.w / 2)
      } else {
        X = mouseX - (bgOpt.w / 2)
      }
      if (mouseY > bgOpt.h / 2) {
        Y = bgOpt.h / 2 - mouseY
      } else {
        Y = bgOpt.h / 2 - mouseY
      }
      dom.style['transform'] = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
      dom.style.transform = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
    },
    bgOut (dom) {
      dom.style['transform'] = 'rotateY(0deg) rotateX(0deg)'
      dom.style.transform = 'rotateY(0deg) rotateX(0deg)'
    }
  },
  components: {
    YShelf,
    mallGoods
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../style/Home/home";
</style>
