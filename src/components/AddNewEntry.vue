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
              <v-text-field
                v-model="newItem.serviceLink"
                label="Link"
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
                  <v-checkbox color="orange lighten-2" class="ma-0"  v-model="configArray" label="Letras Maiusculas" value="ABCDEFGHIJKLMNOPQRSTUVWXYZ"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Letras Minúsculas" value="abcdefghijklmnopqrstuvwxyz"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Números" value="0123456789"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Simbolos" value=" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~"></v-checkbox>
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
import {mapGetters} from "vuex"
export default {
  name: "addNewEntry",
  props: {
    value: Boolean
  },
  computed:{
    ...mapGetters([
      "userData",
    ]),
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
      
      let objToPass = Object.assign(this.newItem, {userId: this.userData.id})
      this.$store.dispatch('verifyIfExistNew', objToPass)
      .then(()=>{
        this.$store.dispatch('saveNewEntry', objToPass)
        this.closeAddDialog()
      }).catch(()=>{
        alert("Já há um registro existente com o mesmo login e mesmo serviço ao qual você está tentando criar. Modifique um dos campos deste registro ou edite o registro existente")
      })

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
    },
    
  }
};
</script>

<style scoped>
#logoPassRemind {
  cursor: pointer;
}
</style>
