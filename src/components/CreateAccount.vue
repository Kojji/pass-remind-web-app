<template>
  <div>
    <v-dialog v-model="openDialog" max-width="480">
      <v-card class="mx-auto">
        <v-card-title>Nova Conta</v-card-title>
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
                    v-model="displayName"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Nome"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                  <v-text-field
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[passwordRules.required, passwordRules.minimum]"
                    :type="show1 ? 'text' : 'password'"
                    v-model="password"
                    label="Senha"
                    required
                    @keydown.enter="validate"
                    @click:append="show1 = !show1"
                    class="mb-4"
                  ></v-text-field>
                  <v-text-field
                    :rules="[passwordRules.required, passwordRules.minimum , confirmPassRule]"
                    :type="show1 ? 'text' : 'password'"
                    v-model="confirmPassword"
                    label="Confirmar Senha"
                    required
                    @keydown.enter="validate"
                    class="mb-8"
                  ></v-text-field>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn text color="red darken-1" @click="openDialog = false">Cancelar</v-btn>
                    <v-btn text color="green darken-1" @click="validate">Criar Conta</v-btn>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'createAccount',
  props: {
    value: Boolean,
  },
  computed:{
    openDialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        if(!value) this.reset();
      }
    },
    confirmPassRule() {
      return v => (!!v && v) === this.password || 'Senhas diferentes indicadas'
    }
  },
  data() {
    return {
      displayName: '',
      valid: true,
      show1: false,
      email: '',
      emailRules: [
        v => !!v || 'Campo Obrigatório',
        v => /.+@.+/.test(v) || 'E-mail em formato inválido'
      ],
      password: '',
      confirmPassword: '',
      passwordRules: {
        required: v => !!v || 'Campo Obrigatório',
        minimum: v => v.length >= 6 || 'Minimo 6 caracteres'
      },
    }
  },
  methods: {
    reset() {
      this.password = '';
      this.confirmPassword = '';
      this.email = '';
      this.displayName = '';
    },
    validate () {
      if (this.$refs.form.validate()) {
        let form = []
        form.nome = this.displayName;
        form.login = this.email;
        form.password = this.password;
        this.$store.dispatch('userSignIn', form)
      }
    },
  }
}
</script>