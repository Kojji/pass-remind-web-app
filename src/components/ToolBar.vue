<template>
  <v-layout wrap>
    <v-app-bar app
    fixed
    dark
    color="orange darken-1"
    >
      <v-toolbar-title @click="redirectHome" class="headline text-uppercase" id="logoPassRemind">
        <span>Pass</span>
        <span class="font-weight-light">Remind</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text :to="redirects.redirectLogin" v-show = "!logged">Entrar</v-btn>
        <v-btn text :to="redirects.redirectUserPage" v-show = "logged">{{ userName() }}</v-btn>
        <v-btn text @click="deslogar" v-show = "logged"><v-icon>{{ toolBarIcons.exitIcon }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </v-layout>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  name: "ToolBar",
  data() {
    return {
      };
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      "redirects",
      "logged",
      "toolBarIcons",
      "userData"
    ]),
    
  },
  methods: {
    redirectHome() {
      this.$router.push('/');
    },
    deslogar() {
      if(confirm("Tem certeza que deseja sair do sistema?")) {
        this.$store.dispatch('userLogoff')
          .then(()=>{
            this.$router.push('/login')
          })
      }
    },
    userName() {
      if(this.userData.displayName === null || !this.userData.displayName || this.userData.displayName === '') {
        return 'Usuário'
      } else {
        return this.userData.displayName
      }
    }
  }
};
</script>
<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>
