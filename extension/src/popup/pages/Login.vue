<template>
  <div id="login">
    <div>
      <div style="padding-bottom: 5px;">
        <label for="email">E-mail</label>
        <input type='text' v-model="email">
      </div>
      <div style="padding-bottom: 5px;">
        <label for="password">Senha</label>
        <input type='password' v-model="password">
      </div>
      <button @click="login" >Login</button>
      <!-- <button @click="loginGoogle" >Google</button> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      password: null,
      email: null,
    }
  },
  methods: {
    login() {
      this.$store.commit('setLoading', true)
      this.$store.dispatch('emailLogin', {login: this.email, password: this.password})
        .then((res)=>{
          this.$router.push("/main");
        }).catch((error)=>{
          alert("e-mail e/ou senha incorretos!")
        }).finally(()=>{
          this.$store.commit('setLoading', false)
        })
    },
    // loginGoogle() {
    //   this.$store.commit('setLoading', true)
    //   this.$store.dispatch('storeGoogleLogin')
    //     .then((res)=>{
    //       this.$router.push("/main");
    //     }).catch((error)=>{
    //       alert("houve um erro ao tentar acessar a conta!")
    //     }).finally(()=>{
    //       this.$store.commit('setLoading', false)
    //     })
    // }
  },
  mounted() {
    this.$store.commit('setLoading', false);
  }
}
</script>
<style scoped>

</style>