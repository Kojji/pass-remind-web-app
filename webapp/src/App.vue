<template>
  <v-app>
    <ToolBar />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import ToolBar from "./components/ToolBar";
import Footer from "./components/Footer";

export default {
  name: 'App',
  components: {
    ToolBar,
    Footer,
  },
  data: () => ({
    //
  }),
};
</script>
