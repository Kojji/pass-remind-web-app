<template>
  <v-card class="mx-auto" max-width="820">
    <v-card-title>teste</v-card-title>
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
            <v-card
              @click="editItem(entry)">
              <v-row>
                <v-col md="4" sm="7">
                  {{ entry.login }}
                </v-col>
                <v-col md="3" sm="5">
                  {{ entry.password }}
                </v-col>
                <v-col md="3" sm="6">
                  {{ entry.service }}
                </v-col>
                <v-col md="2" sm="6">
                  <v-btn text rounded @click.stop="deleteItem(entry)" color="pink"><v-icon>mdi-delete</v-icon></v-btn>
                </v-col>
              </v-row>
              
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      itemsPerPage: 10,
      footerProps: {
        itemsPerPageOptions: [5,10,20,-1],
        itemsPerPageText: 'Itens por página'
      },
      editItemDialog: {}
    };
  },
  computed: {
    ...mapGetters([
      "registriesArray",
      "userData",
    ])
  },
  mounted() {
    if(this.userData !== null)
    this.$store.dispatch('getUserList', this.userData)
  },
  methods: {
    editItem(entry) {
      this.editItemDialog = entry
    },
    deleteItem(entry) {
      // eslint-disable-next-line
      console.log(entry)
    }
  }
}
</script>