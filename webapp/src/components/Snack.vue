<template>
  <div>
    <v-snackbar
      v-model="openSnack"
      :timeout="timeout"
      :color="getSnackText.color"
    >
      {{ getSnackText.text }}
      <v-btn
        class="ml-1"
        color="white"
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