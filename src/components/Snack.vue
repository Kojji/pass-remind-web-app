<template>
  <div>
    <v-snackbar
      v-model="openSnack"
      :timeout="timeout"
      color="grey lighten-4"
      class="deep-orange--text"
    >
      {{ getSnackText }}
      <v-btn
        color="red darken-3"
        text
        @click="openSnack = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
export default {
  name: "snack",
  props: {
    value: Boolean,
  },
  computed:{
    ...mapGetters([
      "getSnackText"
    ]),
    openSnack: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      timeout: 3000
    }
  }
}
</script>