<template>
  <v-layout wrap>
    <v-app-bar app
    fixed
    dense
    dark
    color="orange darken-1"
    >
      <v-toolbar-title class="headline text-uppercase" id="logoPassRemind">
        <span>Pass</span>
        <span class="font-weight-light">Remind</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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

