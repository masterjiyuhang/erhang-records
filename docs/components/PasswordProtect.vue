<!-- PasswordProtect.vue -->
<template>
  <div>
    <div v-if="!authenticated">
      <h2>请输入密码以访问此页面</h2>
      <input v-model="password" type="password" placeholder="输入密码" />
      <button @click="checkPassword">提交</button>
      <p v-if="error" style="color: red">密码错误，请重试</p>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      authenticated: false,
      error: false,
    }
  },
  methods: {
    checkPassword() {
      const correctPassword = '123456' // 设置正确的密码
      if (this.password === correctPassword) {
        this.authenticated = true
        this.error = false
      } else {
        this.error = true
      }
    },
  },
}
</script>

<style scoped>
/* 添加你的样式 */
</style>
