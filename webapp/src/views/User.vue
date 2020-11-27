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
          <v-btn text color="orange darken-1" @click="changeEmail = true">Moddificar Email</v-btn>
          <v-btn text color="orange darken-1" @click="changePass = true" v-show="userData.providerId == 'password'">Modificar senha</v-btn>
        </v-card-actions>
    </v-card>
    <modalChangeFoto v-model="changeFoto" />
    <modalChangePass v-model="changePass" />
    <modalChangeEmail v-model="changeEmail" />
  </v-container>
</template>

<script>
import {mask} from 'vue-the-mask';
import {mapGetters} from 'vuex'
import modalChangeFoto from "@/components/modalChangeFoto.vue"
import modalChangePass from "@/components/modalChangePassLogged.vue"
import modalChangeEmail from "@/components/modalChangeEmail.vue"
export default {
  name: "User",
  components:{
    modalChangeFoto,
    modalChangePass,
    modalChangeEmail
  },
  directives: {
    mask
  },
  data() {
    return {
      edited: {},
      changeFoto: false,
      changePass: false,
      changeEmail: false
    }
  },
  computed: {
    ...mapGetters([
      "userData",
      "editUser"
    ]),
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
    changedValue(field) {
      let toChange = JSON.parse(JSON.stringify(this.userData));
      toChange[field] = this.editUser[field];
      if(this.editUser[field] != this.userData[field]) {
        this.$store.dispatch('editUserInfo', toChange)
          .then(()=>{
            this.$store.commit("setSnackOn",{color: "success", text: "Informação de usuário modificado com sucesso!"})
          }).catch(()=>{
            this.$store.commit("setSnackOn",{color: "red", text: "Erro ao salvar modificações, tente novamente mais tarde!"})
          })
      }
    }
  }
}
</script>