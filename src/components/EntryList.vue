<template>
  <v-card>
    <v-card-title>teste</v-card-title>
    <v-data-table
      :headers="entryListHeaders"
      :items="entriesArray"
    ></v-data-table>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      "entriesArray",
      "entryListHeaders"
    ])
  },
}
</script>