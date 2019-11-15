<template>
  <v-card class="mx-auto">
    <v-container
      class="pa-2"
      fluid
    >
      <v-data-iterator
        :items="registriesArray"
        :items-per-page.sync="itemsPerPage"
        :footer-props="footerProps"
      >
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="entry in props.items"
              :key="entry.id"
              cols="12"
            >
              <v-card>{{ entry }}</v-card>
            </v-col>
          </v-row>
        </template>
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
      itemsPerPage: 10,
      footerProps: {
        itemsPerPageOptions: [5,10,20,-1],
        itemsPerPageText: 'Itens por página'
      },
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
