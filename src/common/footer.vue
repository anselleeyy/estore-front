<template>
  <div class="footer">
    <div class="container">
      <div class="siteinfo">
        <ul class="c0">
          <h3 class="c1">技术架构 - 后端</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="http://projects.spring.io/spring-cloud/">Spring Cloud</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://spring.io/projects/spring-boot">Spring Boot 2</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://cloud.spring.io/spring-cloud-netflix/">Netflix Zuul Eureka</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">技术架构 - 前端</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="https://cn.vuejs.org/">Vue 全家桶</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://element-cn.eleme.io/#/zh-CN">Element-UI</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://www.geetest.com/">极验行为验证</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">技术开源</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/anselleeyy">官方 github</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/Exrick/xmall-front">项目前端</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/Exrick/xmall">项目后端</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">开发者信息</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="https://blog.csdn.net/AnselLyy">个人博客</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://www.ltysyn.cn">个人网站</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/anselleeyy">github 地址</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">其他项目</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="http://xpay.exrick.cn">待开发...</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://shouji.baidu.com/software/11783429.html">待开发...</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/anselleeyy">待开发...</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">友情链接</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="https://spring.io/">Spring Framework</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://www.smartisan.com">锤子科技 - Smartisan</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://cn.vuejs.org/">Vue</a></li>
          </ul>
        </ul>
        <ul class="c4">
          <li class="tel"><a class="c5" href="#" target="_blank">573459407@qq.com</a></li>
          <li class="time">联系我（周一至周五 10:00-21:00）</li>
        </ul>
      </div>

      <div class="copyright">
        <h4 class="content-c2">Copyright ©2018, www.ltysyn.cn Co., Ltd. All Rights Reserved.本网站设计内容大部分采自锤子科技</h4>
        <div class="pdl-10"></div>
        <a class="border-left-1 content-c1" href="https://www.ltysyn.cn/" target="_blank">
          <span class="content-c3">苏ICP备17002894号</span>
        </a>
      </div>
      <div class="cop">
        <ul class="privacy">
          <li class="content-c1"><a class="content-c0" @click="open1">法律声明</a></li>
          <li class="content-c1 border-left-1"><a class="content-c0" @click="open2">隐私条款</a></li>
          <li class="content-c1 border-left-1"><a class="content-c0" target="_blank" href="https://github.com/anselleeyy">开发者中心</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import YButton from '../components/YButton'
export default {
  data () {
    return {
    }
  },
  methods: {
    open1 () {
      this.$notify.warning({
        title: '法律声明',
        message: '此项目仅为个人课程项目，基于开源项目 - xmall 及锤子科技官网，仅供学习参考'
      })
    },
    open2 () {
      this.$notify.info({
        title: '隐私条款',
        message: '本网站将会收集并记录您的信息以及浏览足迹'
      })
    },
    open3 () {
      this.$notify({
        title: '离线帮助',
        message: '没人会帮助你，请自己靠自己',
        type: 'warning'
      })
    },
    open4 () {
      this.$notify.info({
        title: '支付方式',
        message: '支持支付宝、微信等方式捐赠'
      })
    },
    open5 () {
      this.$notify({
        title: '送货政策',
        message: '本网站所有商品购买后不会发货，将用作捐赠',
        type: 'warning'
      })
    }
  },
  components: {
    YButton
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .footer {
    padding: 50px 0 20px;
    border-top: 1px solid #e6e6e6;
    background: #fafafa;
    margin-top: 60px;
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container {
    width: 1220px;
  }

  .siteinfo {
    height: 100px;
    padding: 50px 0 130px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
  }

  .c0 {
    width: 165px;
    line-height: 1;
    float: left;
  }

  .c1 {
    color: #646464;
    font-size: 12px;
    padding: 0 0 14px;
  }

  .c2 {
    color: #c3c3c3;
    font-size: 12px;
    padding: 6px 0;
  }

  .c3 {
    color: #969696;
  }

  .c4 {
    position: absolute;
    right: 0;
    overflow: hidden;
    line-height: 34px;
  }

  .tel {
    font-size: 20px;
    line-height: 1;
    color: #646464;
    top: -2px;
    position: relative;
  }

  .c5 {
    color: #646464;
    right: -50px;
    position: relative;
  }

  .time {
    margin-top: 5px;
    position: relative;
    clear: both;
    width: 241px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }

  .online {
    clear: both;
    width: 241px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }

  .button {
    width: 130px;
    height: 34px;
    font-size: 14px;
    color: #5079d9;
    border: 1px solid #dcdcdc;
    margin-top: 8px;
  }

  .copyright {
    color: #434d55;
    font-size: 12px;
    padding: 40px 0 0;
    display: flex;
    align-items: left;
    margin: auto;
    width: 700px;
  }

  .pdl-10 {
    padding-left: 10px;
  }

  .privacy {
    float: left;
    margin: auto;
  }

  .content-c0 {
    color: #5079d9;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      color: #3A5FCD;
    }
  }

  .content-c1 {
    float: left;
    line-height: 12px;
    padding: 1px 10px 0 0;
  }

  .border-left-1 {
    border-left: 1px solid #ccc;
    padding-left: 10px;
  }

  .content-c2 {
    float: left;
    height: 15px;
    line-height: 15px;
    color: #757575;
  }

  .cop {
    clear: both;
    padding: 10px 0 0;
    height: 15px;
    color: #434d55;
    font-size: 12px;
    display: flex;
    align-items: left;
    width: 500px;
    margin: auto;
  }

  .content-c3 {
    margin-right: 20px;
    color: #bdbdbd;
    font-size: 12px;
    height: 12px;
    line-height: 1;
  }
</style>
