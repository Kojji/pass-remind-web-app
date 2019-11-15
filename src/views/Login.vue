<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-actions>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-form 
              ref="form"
              v-model="valid"
              lazy-validation
            >
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
                @click:append="show1 = !show1"
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                color="success"
                text
                @click="validate"
              >
              Entrar
              </v-btn>
              <v-btn
                color="orange"
                text
                @click="createAccount"
              >
              Criar Conta
              </v-btn>
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
    }
  }
}
</script>