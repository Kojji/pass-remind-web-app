<template>
  <v-container>
    <v-card class="mx-auto" max-width="480">
      <v-card-title class="mb-4">
        <v-btn icon class="mr-4" color="orange darken-1" :to="'/'">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        Editar Informações
      </v-card-title>
      <!-- colocar foto -->
      <v-card-text>
        <v-text-field
          v-model="edited.email"
          label="Email"
          disabled
        ></v-text-field>
        <v-text-field
          v-model="edited.displayName"
          label="Nome do usuário"
          @change="changedValue('displayName')"
        ></v-text-field>
        <v-text-field
          v-model="edited.phoneNumber"
          label="Telefone"
          @change="changedValue('phoneNumber')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <!-- <v-btn text color="orange darken-1" @click="cancelar">Cancelar</v-btn> -->
          <v-btn text color="red darken-1" @click="modificarSenha" v-show="userData.providerId == 'password'">Modificar senha</v-btn>
        </v-card-actions>
    </v-card>
    <snack v-model="getShowSnack" />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import firebase from 'firebase'
import snack from "../components/Snack"
export default {
  name: "User",
  components:{
    snack
  },
  data() {
    return {
      edited: {}
    }
  },
  computed: {
    ...mapGetters([
      "userData"
    ]),
    getShowSnack: {
      get () {
        return this.$store.getters.getShowSnack
      },
      set (value) {
        if(!value) {
          this.$store.commit('setSnackOff')
        }
      }
    }
  },
  mounted() {
    this.edited = {
      displayName: this.userData.displayName,
      phoneNumber: this.userData.phoneNumber,
      email: this.userData.email,
      photoURL: this.userData.photoURL
    }
  },
  methods: {
    cancelar() {
      this.$router.push('/')
    },
    modificarSenha() {
      // modificar senha no firebase
    },
    salvarEditado() {
      // salvar mudanças no documento do firebase
    },
    changedValue(type) {
      var user = firebase.auth().currentUser;
      let toChange = {}
      switch(type) {
        case "displayName":
          toChange = { displayName: this.edited.displayName }
          break
        case "phoneNumber": 
          toChange = { phoneNumber: this.edited.phoneNumber }
          break
        case "photoURL":
          toChange = { phoneNumber: this.edited.photoURL }
          break
        default:
          break
      }
      user.updateProfile(toChange)
        .then(()=>{
          this.$store.commit("setSnackOn","Informação de usuário modificado com sucesso!")
        }).catch(()=>{
          this.$store.commit("setSnackOn","Erro ao salvar modificações, tente novamente mais tarde!")
        })
    }
  }
}
</script>