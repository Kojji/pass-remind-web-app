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
                  <v-text-field
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    v-model="confirmPassword"
                    label="Confirmar Senha"
                    required
                    @keydown.enter="validate"
                    class="mb-8"
                  ></v-text-field>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn text color="red darken-1" @click="closeCreateDialog">Cancelar</v-btn>
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
      }
    }
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
      confirmPassword: '',
      passwordRules: [
        v => !!v || 'Campo Obrigatório',
        v => v.length >= 4 || 'Minimo 4 caracteres'
      ],
    }
  },
  methods: {
    closeCreateDialog() {
      this.openDialog = false
      this.password = ''
      this.confirmPassword = ''
      this.email = ''
    },
    validate () {
      if (this.$refs.form.validate()) {
        let form = []
        form.login = this.email;
        form.password = this.password;
        // eslint-disable-next-line
        console.log(form)
      }
    },
  }
}
</script>