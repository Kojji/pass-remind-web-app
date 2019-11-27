<template>
  <v-layout wrap>
    <v-app-bar app
    fixed
    dark
    color="orange darken-1"
    >
      <v-toolbar-title class="headline text-uppercase" id="logoPassRemind" @click="redirectHome">
        <span>Pass</span>
        <span class="font-weight-light">Remind</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text :to="redirects.redirectLogin" v-show = "!logged">Entrar</v-btn>
        <v-btn text :to="redirects.redirectUserPage" v-show = "logged">Usuário</v-btn>
      </v-toolbar-items>
      <template #extension v-if="logged">
        <v-toolbar-items >
          <v-btn text @click="addEntry"><v-icon>{{ toolBarIcons.addIcon }}</v-icon></v-btn>
          <v-btn text @click="deslogar"><v-icon>{{ toolBarIcons.exitIcon }}</v-icon></v-btn>
        </v-toolbar-items>
      </template>
    </v-app-bar>
    <addNewEntry v-model="addNewDialog" />
  </v-layout>
</template>

<script>
import {mapGetters} from "vuex"
import addNewEntry from "../components/AddNewEntry"

export default {
  name: "ToolBar",
  components:{
    addNewEntry
  },
  data() {
    return {
      newItem:{},
      addNewDialog: false,
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
    redirectHome() {
      this.$router.push('/')
    },
    deslogar() {
      if(confirm("Tem certeza que deseja sair do sistema?")) {
        this.$store.dispatch('userLogoff')
          .then(()=>{
            this.$router.push('/login')
          })
      }
    },
    addEntry() {
      this.addNewDialog = true
    },
  }
};
</script>
<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>

