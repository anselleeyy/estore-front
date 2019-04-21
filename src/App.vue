<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "assets/style/index.scss";
  #app {
    height: 100%;
    width: 100%;
  }
  .main {
    background: #ededed;;
  }
</style>
