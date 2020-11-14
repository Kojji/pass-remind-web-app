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
      <v-row class="justify-center">
        <v-avatar
          v-if="editUser.photoURL"
          color="orange"
          size="70"  
        >
          <v-img 
            :src="editUser.photoURL"
          >
          </v-img>
        </v-avatar>
        <v-avatar 
          color="orange"
          v-else
          size="70"
        >
          <v-icon 
            dark
            size="70"
          >
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-row>
      <v-row class="justify-center pt-2">
        <v-btn outlined text @click="changeFoto = true">Mudar Foto</v-btn>
      </v-row>

      <v-card-text>
        <v-text-field
          :value="editUser.email ? editUser.email : ''"
          @input="setEditUserByField('email', $event)"
          label="Email"
          disabled
        ></v-text-field>
        <v-text-field
          :value="editUser.displayName ? editUser.displayName : ''"
          @input="setEditUserByField('displayName', $event)"
          label="Nome do usuário"
          @blur="changedValue('displayName')"
        ></v-text-field>
        <v-text-field
          :value="editUser.phoneNumber ? editUser.phoneNumber : ''"
          @input="setEditUserByField('phoneNumber', $event)"
          label="Telefone"
          v-mask="'(##)#####-####'"
          @blur="changedValue('phoneNumber')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <!-- <v-btn text color="orange darken-1" @click="cancelar">Cancelar</v-btn> -->
          <v-btn text color="red darken-1" @click="modificarSenha" v-show="userData.providerId == 'password'">Modificar senha</v-btn>
        </v-card-actions>
    </v-card>
    <snack v-model="getShowSnack" />
    <modalChangeFoto v-model="changeFoto" />
  </v-container>
</template>

<script>
import {mask} from 'vue-the-mask';
import {mapGetters} from 'vuex'
import snack from "../components/Snack"
import modalChangeFoto from "@/components/modalChangeFoto.vue"
export default {
  name: "User",
  components:{
    snack,
    modalChangeFoto
  },
  directives: {
    mask
  },
  data() {
    return {
      edited: {},
      changeFoto: false
    }
  },
  computed: {
    ...mapGetters([
      "userData",
      "editUser"
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
  },
  methods: {
    setEditUserByField(field, value) {
      this.$store.commit('setEditUserByField', {field, value})
    },
    cancelar() {
      this.$router.push('/')
    },
    modificarSenha() {
      // modificar senha no firebase
    },
    salvarEditado() {
      // salvar mudanças no documento do firebase
    },
    changedValue(field) {
      let toChange = JSON.parse(JSON.stringify(this.userData));
      toChange[field] = this.editUser[field];
      if(this.editUser[field] != this.userData[field]) {
        this.$store.dispatch('editUserInfo', toChange)
          .then(()=>{
            this.$store.commit("setSnackOn","Informação de usuário modificado com sucesso!")
          }).catch(()=>{
            this.$store.commit("setSnackOn","Erro ao salvar modificações, tente novamente mais tarde!")
          })
      }
    }
  }
}
</script>