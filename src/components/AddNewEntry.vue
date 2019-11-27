<template>
  <div>
    <v-dialog v-model="openDialog" max-width="580">
      <v-card class="mx-auto">
        <v-card-title>Nova Senha</v-card-title>
        <v-card-text>
          <v-row>
            <v-col xs="12" sm="6">
              <v-text-field
                v-model="newItem.login"
                label="Login"
                required
              ></v-text-field>
              <v-text-field
                append-icon="mdi-key"
                @click:append="passwordGenerator"
                v-model="newItem.password"
                label="Senha"
                required
              ></v-text-field>
              <v-text-field
                v-model="newItem.service"
                label="Serviço"
                required
              ></v-text-field>
            </v-col>
            <v-col sm="6" class="d-none d-sm-flex">
              <v-text-field
                
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red darken-1" @click="closeAddDialog">Cancel</v-btn>
          <v-btn text color="green darken-1" @click="saveNewEntry">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "addNewEntry",
  props: {
    value: Boolean
  },
  computed:{
    openDialog: {
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
      newItem:{},
      };
  },
  methods: {
    saveNewEntry() {
      // eslint-disable-next-line
      console.log(this.newItem)
    },
    closeAddDialog() {
      this.openDialog = false
      this.newItem = {}
    },
    passwordGenerator() {
      //get vuex config info and generate the password
    }
  }
};
</script>

<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>
