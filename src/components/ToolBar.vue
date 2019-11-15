<template>
  <v-layout wrap>
    <v-app-bar app
    fixed
    dense
    :extended="logged"
    dark
    color="orange darken-1"
    >
      <v-toolbar-title class="headline text-uppercase" id="logoPassRemind">
        <span>Pass</span>
        <span class="font-weight-light">Remind</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text :to="redirects.redirectLogin" v-show = "!logged">Entrar</v-btn>
        <v-btn text :to="redirects.redirectUserPage" v-show = "logged">Usuário</v-btn>
      </v-toolbar-items>
      <template #extension>
        <v-toolbar-items>
          <v-btn text><v-icon>{{ toolBarIcons.addIcon }}</v-icon></v-btn>
          <v-btn text @click="deslogar"><v-icon>{{ toolBarIcons.exitIcon }}</v-icon></v-btn>
        </v-toolbar-items>
      </template>
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
    ])
    
  },
  methods: {
    deslogar() {
      if(confirm("Tem certeza que deseja sair do sistema?")) {
        this.$store.dispatch('userLogoff')
          .then(()=>{
            this.$router.push('/login')
          })
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

