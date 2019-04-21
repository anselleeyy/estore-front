<template>
  <input :type="inputType"
         readonly
         :class="classStyle"
         @click="btnClick($event)"
         :disabled="classStyle === 'disabled-btn'"
         :value="text">
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Number],
      default: '一颗小按钮'
    },
    inputType: {
      type: [String],
      default: 'button'
    },
    classStyle: {
      type: String,
      default: 'default-btn'
    }
  },
  methods: {
    btnClick (event) {
      this.$emit('btnClick', event)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  @import "../assets/style/theme";
  @import "../style/button";

</style>
