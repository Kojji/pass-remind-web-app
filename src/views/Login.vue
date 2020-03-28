<template>
  <v-card class="mx-auto" max-width="480">
    <v-card-actions>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-form
              ref="form"
              v-model="valid"
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
                  :rules="[rules.required]"
                  :type="show1 ? 'text' : 'password'"
                  v-model="password"
                  label="Password"
                  required
                  @keydown.enter="validate"
                  @click:append="show1 = !show1"
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  :disabled="!valid"
                  color="success"
                  text
                  @click="validate"
                >
                Entrar
                </v-btn>
                <v-btn
                  color="blue"
                  text
                  @click="enterGoogle"
                >
                Conta Google
                </v-btn>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
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
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      
    ])
  },
  data() {
    return {
      valid: true,
      show1: false,
      email: '',
      emailRules: [
        v => !!v || 'Campo Obrigatório',
        v => /.+@.+/.test(v) || 'E-mail em formato inválido'
      ],
      password: '',
      rules: {
        required: value => !!value || 'Campo Obrigatório',
        min: v => v.length >= 4 || 'Minimo 4 caracteres'
      },
    }
  },
  methods:{
    validate () {
      if (this.$refs.form.validate()) {
        let form = []
        form.login = this.email;
        form.password = this.password;
        this.$store.dispatch('userLogin', form)
        .then(()=>{
          this.$store.dispatch('getUserInfo')
          .then(()=>{
            this.$router.push('/')
          })
        }).catch((error)=>{
          if(error === 'err1') { alert("Conta não encontrada") }
          else {alert("Problema ao tentar entrar no sistema, tente mais tarde") }
        })
      }
    },
    createAccount() { // mudar depois, realiza login "automatico" no desenvolvimento
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
    },
    enterGoogle() {
      this.$store.dispatch('storeGoogleLogin')
    },
    resetPassword() {
      
    }
  }
}
</script>