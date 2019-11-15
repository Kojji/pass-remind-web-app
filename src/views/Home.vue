<template>
  <v-card class="mx-auto">
    <v-container
      class="pa-2"
      fluid
    >
      <v-data-iterator>

      </v-data-iterator>
    </v-container>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  name: "Home",
  data() {
    return {
      };
  },
  mounted() {
    if(this.userData !== null)
    this.$store.dispatch('getUserList', this.userData)
  },
  computed: {
    ...mapGetters([
      "userData",
      "registriesArray"
      
    ])
    
  },
  methods: {
    
  }
};
</script>
