<template>
  <div>
    <v-card class="mx-auto" max-width="480">
      <v-card-actions>
        <v-container fluid>
          <v-row class="justify-center">
            <v-img
              src="@/assets/pssrLogo-128.png"
              max-height="70"
              max-width="70"
            >
            </v-img>
          </v-row>
          <v-row class="justify-center">
            <p class="orange--text font-weight-bold">PassRemind</p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-form
                ref="form"
                lazy-validation
              >
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                  <v-text-field
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    v-model="password"
                    label="Senha"
                    required
                    @keydown.enter="validate"
                    @click:append="show1 = !show1"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    color="success"
                    text
                    small
                    @click="validate"
                  >
                  Entrar
                  </v-btn>
                  <!-- <v-btn
                    color="blue"
                    text
                    @click="enterGoogle"
                  >
                  Conta Google
                  </v-btn> -->
                  <v-btn
                    color="orange"
                    text
                    @click="createAccount"
                    small
                  >
                  Criar Conta
                  </v-btn>
                  <v-btn
                    color="red"
                    text
                    @click="resetPassword"
                    small
                  >
                  Esqueci Minha Senha
                  </v-btn>
                </v-col>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
    <createAccount v-model="openCreate"/>
    <changePass v-model="openRedefinir"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  components: {
    createAccount: () => import("../components/CreateAccount"),
    changePass: () => import("../components/ChangePass"),
  },
  computed: {
    ...mapGetters([
      
    ])
  },
  data() {
    return {
      loading: false,
      show1: false,
      email: '',
      emailRules: [
        v => !!v || 'Campo Obrigatório',
        v => /.+@.+/.test(v) || 'E-mail em formato inválido'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Campo Obrigatório',
        v => v.length >= 6 || 'Minimo 6 caracteres'
      ],
      openCreate: false,
      openRedefinir: false,
    }
  },
  methods:{
    validate () {
      if (this.$refs.form.validate()) {
        let form = []
        form.login = this.email;
        form.password = this.password;
        this.loading = true;
        this.$store.dispatch('userLogin', form)
        .catch((error)=>{
          if(error === 'err1') { alert("Conta não encontrada") }
          else {alert("Problema ao tentar entrar no sistema, tente mais tarde") }
        }).finally(()=>{
          this.loading = false;
        })
      }
    },
    createAccount() { // mudar depois, realiza login "automatico" no desenvolvimento
      this.openCreate = true
    },
    /* testUser() {
      let form = []
      form.login = "teste@teste.com";
      form.password = "teste";
      this.$store.dispatch('userLogin', form)
      .then(()=>{
        this.$store.dispatch('getUserInfo')
        .then(()=>{
          this.$router.push('/')
        })
      })
    }, */
    // enterGoogle() {
    //   this.$store.dispatch('storeGoogleLogin')
    // },
    resetPassword() {
      this.openRedefinir = true
    }
  }
}
</script>