<template>
  <div class="login-container">
    <transition name="form-fade" mode="in-out">
      <div class="login-form" v-show="showLogin">
        <div class="login-logo">
          <img src="/static/img/logo.png"> <span>欢迎登录 学子商城</span>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div id="captcha">
              <p id="wait">正在加载验证码...</p>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="submitForm('loginForm')" class="submit_btn">{{ loginTxt }}</el-button>
            <el-button type="warning" plain class="submit_btn">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="login-account"></div>
      </div>
    </transition>
    <div id="loginThree"></div>
  </div>
</template>

<script>
import THREE from '../../libs/three/three'
import 'element-ui/lib/theme-chalk/index.css'
import { login, geetest } from '../../api'
import { setStore } from '../../utils/storage'
require('../../../static/geetest/gt.js')
let captcha

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        errMsg: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      showLogin: false,
      loginTxt: '登录',
      statusKey: ''
    }
  },
  computed: {
    count () {
      return this.$store.state.login
    }
  },
  mounted () {
    const that = this
    that.init_geetest()
    // that.init_3D()
    that.showLogin = true
    that.open('登录提示', '测试体验账号： admin | admin')
  },
  methods: {
    submitForm (formName) {
      this.loginTxt = '登录中 ...'
      if (!this.loginForm.username || !this.loginForm.password) {
        // this.ruleForm.errMsg = '账号或者密码不能为空!'
        this.message('账号或者密码不能为空!')
        this.loginTxt = '登录'
        return false
      }
      let result = captcha.getValidate()
      if (!result) {
        this.message('请先完成验证')
        this.loginTxt = '登录'
        return false
      }
      let params = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        challenge: result.geetest_challenge,
        validate: result.geetest_validate,
        seccode: result.geetest_seccode,
        statusKey: this.statusKey
      }
      login(params).then(res => {
        if (res.result.state === 1) {
          setStore('token', res.result.token)
          setStore('userId', res.result.user.id)
          this.$router.push({
            path: '/'
          })
        } else {
          this.loginTxt = '登录'
          this.message(res.result.message)
          captcha.reset()
          return false
        }
      })
    },
    message (m) {
      this.$message.error({
        message: m
      })
    },
    messageSuccess (m) {
      this.$message.success({
        message: m
      })
    },
    init_geetest () {
      geetest().then(res => {
        this.statusKey = res.statusKey
        window.initGeetest({
          gt: res.gt,
          challenge: res.challenge,
          new_captcha: res.new_captcha,
          offline: !res.success,
          product: 'popup',
          width: '100%'
        }, function (captchaObj) {
          captcha = captchaObj
          captchaObj.appendTo('#captcha')
          captchaObj.onReady(function () {
            document.getElementById('wait').style.display = 'none'
          })
        })
      })
    },
    open (t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    init_3D () {
      const SCREEN_WIDTH = window.innerWidth
      const SCREEN_HEIGHT = window.innerHeight
      let SEPARATION = 90
      let AMOUNTX = 50
      let AMOUNTY = 50
      let container
      let particles, particle
      let count
      let camera
      let scene
      let renderer
      let mouseX = 0
      /* eslint-disable no-unused-vars */
      let mouseY = 0
      let windowHalfX = window.innerWidth / 2
      let windowHalfY = window.innerHeight / 2
      init()
      this.interval = setInterval(loop, 1000 / 60)
      function init () {
        container = document.createElement('div')
        container.style.position = 'relative'
        container.style.top = '200px'
        document.getElementById('loginThree').appendChild(container)
        camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000)
        camera.position.z = 1000
        scene = new THREE.Scene()
        renderer = new THREE.CanvasRenderer()
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        particles = {}
        var i = 0
        var material = new THREE.ParticleCircleMaterial(0x097bdb, 1)
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[ i++ ] = new THREE.Particle(material)
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2)
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2)
            scene.add(particle)
          }
        }
        count = 0
        container.appendChild(renderer.domElement)
        document.addEventListener('mousemove', onDocumentMouseMove, false)
        document.addEventListener('touchmove', onDocumentTouchMove, false)
      }
      function onDocumentMouseMove (event) {
        mouseX = event.clientX - windowHalfX
        mouseY = event.clientY - windowHalfY
      }
      function onDocumentTouchMove (event) {
        if (event.touches.length === 1) {
          event.preventDefault()
          mouseX = event.touches[ 0 ].pageX - windowHalfX
          mouseY = event.touches[ 0 ].pageY - windowHalfY
        }
      }
      function loop () {
        camera.position.x += (mouseX - camera.position.x) * 0.05
        camera.position.y = 364
        var i = 0
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[ i++ ]
            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50)
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2
          }
        }
        renderer.render(scene, camera)
        count += 0.1
      }
    }
  }
}
</script>

<style scoped>
  @import "../../style/Login/login.css";

</style>
