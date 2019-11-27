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
                @click:append.stop="passwordGenerator"
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
              <v-row>
                <v-col cols="12">
                  <v-slider
                    v-model="passLength"
                    :max="maxLength"
                    :min="minLength"
                    thumb-color="orange lighten-1"
                    color="orange lighten-1"
                    thumb-label="always"
                    label="Tamanho"
                  ></v-slider>
                  <v-checkbox color="orange lighten-2" class="ma-0"  v-model="configArray" label="Uppercase Letters" value="ABCDEFGHIJKLMNOPQRSTUVWXYZ"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Lowercase Letters" value="abcdefghijklmnopqrstuvwxyz"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Numbers" value="0123456789"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Symbols" value=" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~"></v-checkbox>
                </v-col>
              </v-row>
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
      newItem:{
        password: null,
      },
      passLength: 15,
      configArray: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz', '0123456789', ' !#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'],
      minLength: 5,
      maxLength: 30
      };
  },
  methods: {
    saveNewEntry() {
      // eslint-disable-next-line
      console.log(this.newItem)
      // vuex para verificar nova senha
      // vuex para gravar nova senha

      this.closeAddDialog()
    },
    closeAddDialog() {
      this.openDialog = false
      this.newItem = { password: null }
    },
    passwordGenerator() {
      let all = '';
      for(let contador = 0; contador <= this.configArray.length -1; contador++){
        all+=this.configArray[contador];
      }
      var password = '';
      for (var index = 0; index < this.passLength; index++) {
          var character = Math.floor(Math.random() * all.length);
          password += all.substring(character, character + 1);
      }
      this.newItem.password = password;
    }
  }
};
</script>

<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>
