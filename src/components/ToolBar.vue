<template>
  <v-layout wrap>
    <v-app-bar app
    fixed
    dense
    extended
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
          <v-btn text><v-icon>Criar Registro</v-icon></v-btn>
          <v-btn text><v-icon>Sair</v-icon></v-btn>
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
      "logged"
    ])
    
  },
  methods: {
    
  }
};
</script>
<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>

