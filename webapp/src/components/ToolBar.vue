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
        <v-btn text :to="redirects.redirectUserPage" v-show = "logged">
          <v-avatar
          v-if="userData.photoURL"
            color="orange"  
          >
            <v-img 
              :src="userData.photoURL"
            >
            </v-img>
          </v-avatar>
          <v-avatar 
            color="orange"
            v-else
          >
            <v-icon
              dark
            >
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-btn>
        <v-btn text @click="deslogar" v-show = "logged">Sair <v-icon small class="ml-2">{{ toolBarIcons.exitIcon }}</v-icon></v-btn>
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
        this.$store.commit("setRegistriesArray", [])
        this.$store.dispatch('userLogoff')
        .then(()=>{
          this.$router.push('/login')
        })
      }
    },
  }
};
</script>
<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>
