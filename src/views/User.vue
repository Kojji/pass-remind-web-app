<template>
  <v-container>
    <v-card class="mx-auto" max-width="720">
      <v-card-title>
        <v-btn icon class="mr-4" color="orange darken-1" :to="'/'">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        Editar Informações
      </v-card-title>
      <!-- colocar foto -->
      <span>{{userData.email}}</span>
      <v-card-actions>
        <div class="d-flex">
          <v-col cols="12">
            
          </v-col>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "User",
  computed: {
    ...mapGetters([
      "userData"
    ])
  },
  methods: {
    
  }
}
</script>