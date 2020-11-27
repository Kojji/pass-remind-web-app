<template>
  <div>
    <v-dialog v-model="openDialog" max-width="480">
      <v-card class="mx-auto">
        <v-card-title>Redefinir E-mail</v-card-title>
        <v-card-actions v-if="!confirmed">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="formConfirm"
                  lazy-validation
                >
                  <v-text-field
                    v-model="oldPass"
                    :rules="passwordRules"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    label="Senha Atual"
                    required
                  ></v-text-field>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn text color="red darken-1" @click="openDialog = false">Cancelar</v-btn>
                    <v-btn 
                      text 
                      color="green darken-1" 
                      @click="confirmOldPass"
                      :disabled="loadingButton"
                      :loading="loadingButton"  
                    >Confirmar Senha</v-btn>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
        <v-card-actions v-else>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="formNewEmail"
                  lazy-validation
                >
                  <v-text-field
                    v-model="newEmail"
                    :rules="emailRules"
                    label="Novo E-mail"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="confimNew"
                    :rules="[confirmEmailRule]"
                    label="Redigir E-mail"
                    required
                  ></v-text-field>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn text color="red darken-1" @click="openDialog = false">Cancelar</v-btn>
                    <v-btn 
                      text 
                      color="green darken-1" 
                      @click="validate"
                      :disabled="loadingButton"
                      :loading="loadingButton"  
                    >Redefinir E-mail</v-btn>
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
  name: 'changeEmail',
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
    confirmEmailRule() {
      return v => (!!v && v) === this.newEmail || 'E-mails diferentes indicados'
    }
  },
  data() {
    return {
      loadingButton: false,
      oldPass: "",
      newEmail: "",
      confimNew: "",
      confirmed: false,
      show1: false,
      passwordRules: [
        v => !!v || 'Campo Obrigatório',
        v => v.length >= 6 || 'Minimo 6 caracteres'
      ],
      emailRules: [
        v => !!v || 'Campo Obrigatório',
        v => /.+@.+/.test(v) || 'E-mail em formato inválido'
      ],
    }
  },
  methods: {
    reset() {
      this.oldPass = "";
      this.newEmail = "";
      this.confimNew = "";
      this.confirmed = false;
    },
    confirmOldPass() {
      if (this.$refs.formConfirm.validate()) {
        this.loadingButton = true;
        this.$store.dispatch('confirmOldPassword', this.oldPass)
        .then(()=>{
          this.confirmed = true;
        }).catch((wrongPassword)=> {
          if(wrongPassword) {
            this.$store.commit("setSnackOn",{color: "orange", text: "Senha fornecida é incorreta!"});
          } else {
            this.$store.commit("setSnackOn",{color: "red", text: "Houve um problema ao tentar confirmar sua senha!"});
          }
        }).finally(()=>{
          this.loadingButton = false;
        })
      }
    },
    validate () {
      if (this.$refs.formNewEmail.validate()) {
        this.loadingButton = true;
        this.$store.dispatch('changeEmailLogged', this.newEmail)
        .then(()=>{
          this.$store.commit("setSnackOn",{color: "success", text: "E-mail modificado com sucesso!"});
          this.openDialog = false;
        }).catch(()=>{
          this.$store.commit("setSnackOn",{color: "red", text: "Erro ao tentar modificar e-mail!"});
        }).finally(()=>{
          this.loadingButton = false;
        })
      }
    },
  }
}
</script>