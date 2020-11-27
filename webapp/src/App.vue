<template>
  <v-app>
    <ToolBar />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <snack v-model="getShowSnack" />
    <Footer />
  </v-app>
</template>

<script>
import ToolBar from "@/components/ToolBar";
import Footer from "@/components/Footer";
import snack from "@/components/Snack"

export default {
  name: 'App',
  components: {
    ToolBar,
    Footer,
    snack
  },
  computed: {
    getShowSnack: {
      get () {
        return this.$store.getters.getShowSnack
      },
      set (value) {
        if(!value) {
          this.$store.commit('setSnackOff')
        }
      }
    }
  },
  data: () => ({
    //
  }),
};
</script>
