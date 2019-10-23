<template>
  <v-app>
    <ToolBar />
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
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
