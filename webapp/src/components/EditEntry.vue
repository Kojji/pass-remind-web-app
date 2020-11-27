<template>
  <div>
    <v-dialog v-model="openDialog" max-width="580">
      <v-card class="mx-auto">
        <v-card-title>Editar Senha</v-card-title>
        <v-card-text>
          <v-row>
            <v-col xs="12" sm="6">
              <v-form
                ref="formEntry"
                lazy-validation
              >
                <v-text-field
                  v-model="toEdit.service"
                  label="Nome Registro"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="toEdit.login"
                  label="Login"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  required
                ></v-text-field>
                <v-text-field
                  append-icon="mdi-key"
                  @click:append.stop="passwordGenerator"
                  v-model="toEdit.password"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  label="Senha"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="toEdit.serviceLink"
                  label="Link"
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col sm="6" class="d-none d-sm-flex">
              <v-row>
                <v-col cols="12">
                  <v-slider
                    v-model="passLength"
                    :max="maxLength"
                    :min="minLength"
                    thumb-color="red lighten-1"
                    color="red lighten-1"
                    thumb-label="always"
                    label="Tamanho"
                  ></v-slider>
                  <v-checkbox color="red lighten-2" class="ma-0"  v-model="configArray" label="Letras Maiusculas" value="ABCDEFGHIJKLMNOPQRSTUVWXYZ"></v-checkbox>
                  <v-checkbox color="red lighten-2" class="ma-0" v-model="configArray" label="Letras Minúsculas" value="abcdefghijklmnopqrstuvwxyz"></v-checkbox>
                  <v-checkbox color="red lighten-2" class="ma-0" v-model="configArray" label="Números" value="0123456789"></v-checkbox>
                  <v-checkbox color="red lighten-2" class="ma-0" v-model="configArray" label="Simbolos" value=" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~"></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            text 
            color="red darken-1" 
            @click="deleteItem"
            :disabled="getStoreAuxButtonLoading"
            :loading="getStoreAuxButtonLoading"  
          >Apagar</v-btn>
          <v-btn text color="orange darken-1" @click="openDialog = false;">Cancelar</v-btn>
          <v-btn 
            text 
            color="green darken-1" 
            @click="saveEditEntry"
            :disabled="getStoreButtonLoading"
            :loading="getStoreButtonLoading"  
          >Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
export default {
  name: "editEntry",
  props: {
    value: Boolean,
    toEdit: Object
  },
  data(){
    return {
      passLength: 15,
      configArray: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz', '0123456789', ' !#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'],
      minLength: 5,
      maxLength: 30,
      received: null
    }
  },
  computed:{
    ...mapGetters([
      "userData",
      "getStoreButtonLoading",
      "getStoreAuxButtonLoading"
    ]),
    openDialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        if(!value) this.reset();
      }
    }
  },
  updated() {
    this.received = JSON.parse(JSON.stringify(this.toEdit));
  },
  methods: {
    reset() {
      this.received = null;
    },
    saveEditEntry() {
      let editOldNew = {
        old: this.received,
        new: this.toEdit
      }
      if (this.$refs.formEntry.validate()) {
        this.$store.commit("setStoreButtonLoading", true);
        this.$store.dispatch('verifyIfExistEdit', editOldNew)
        .then(()=>{
          editOldNew.new.dateStamp = new Date().getTime()
          this.$store.dispatch('editEntry', editOldNew)
          .then(()=>{
            this.$store.commit("setSnackOn",{color: "success", text: "Registro modificado com sucesso!"});
            this.$store.commit("setStoreButtonLoading", false);
            this.openDialog = false;
          }).catch(()=>{
            this.$store.commit("setStoreButtonLoading", false);
            this.$store.commit("setSnackOn",{color: "red", text: "Problema ao editar registro!"});
          })
        }).catch(()=>{
          this.$store.commit("setStoreButtonLoading", false);
          this.$store.commit("setSnackOn",{color: "orange", text: "Já há um registro com o mesmo nome!"});
        })
      }
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
      this.toEdit.password = password;
    },
    deleteItem() {
      if(confirm("Você está prestes a deletar uma senha, deseja continuar?")) {
        this.$store.commit("setStoreAuxButtonLoading", true);
        this.$store.dispatch('deleteEntry', this.toEdit)
          .then(()=>{
            this.$store.commit("setStoreAuxButtonLoading", false);
            this.$store.commit("setSnackOn",{color: "success", text: "Registro excluido com sucesso!"});
            this.openDialog = false;
          }).catch(()=>{
            this.$store.commit("setStoreAuxButtonLoading", false);
            this.$store.commit("setSnackOn",{color: "red", text: "Problema ao deletar registro!"});
          })
      }
    }
  }
}
</script>