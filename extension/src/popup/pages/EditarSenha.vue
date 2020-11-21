<template>
  <div id="editar-senha">
    <div class="fields">
      <div class="criar-senha">
        <label for="service">Nome</label>
        <input type='text' v-model="service">
      </div>
      <div class="criar-senha">
        <label for="login">Login</label>
        <input type='text' v-model="login">
      </div>
      <div class="criar-senha">
        <label for="password">Senha</label>
        <input type='text' v-model="password">
      </div>
      <div class="criar-senha">
        <label for="serviceLink">Site</label>
        <input type='text' v-model="site" disabled>
      </div>
    </div>
    <div style="margin-top: 5px;">
      <button @click="generatePass">Gerar Senha</button>
    </div>
    <div style="margin-top: 5px;">
      <button @click="cancelar">Cancelar</button>
      <button @click="editarSenha">Salvar</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "editarSenha",
  data() {
    return {
      service: null,
      login: null,
      password: null,
      site: null,
      configArray: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz', '0123456789', ' !#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~']
    }
  },
  methods: {
    cancelar() {
      this.service = null;
      this.login = null;
      this.password = null;
      this.site = null;
      this.$router.push("/main");
    },
    editarSenha() {
      if(this.service == '' || this.login == '' || this.password == ''){
        alert("Todos os campos precisam ser preenchidos!");
      }
      else {
        this.$store.commit('setLoadingModal', true);
          let editOldNew = {
          old: {
            serviceLink: this.getEditEntry.serviceLink,
            service: this.getEditEntry.service,
            login: this.getEditEntry.login,
            password: this.getEditEntry.password,
          },
          new: {
            serviceLink: this.site,
            service: this.service,
            login: this.login,
            password: this.password,
          }
        }
        this.$store.dispatch('verifyIfExistEdit', editOldNew)
          .then(()=>{
            editOldNew.new.dateStamp = new Date().getTime()
            this.$store.dispatch('editEntry', editOldNew)
            .then(()=>{
              this.cancelar();
            }).catch(()=>{
              alert("Erro ao tentar modificar uma senha")
            })
          }).catch(()=>{
            alert("Já há um registro existente com o mesmo nome ao qual você está tentando editar. Modifique o nome deste registro ou edite o registro existente")
          }).finally(()=>{
            this.$store.commit('setLoadingModal', false);
          })
        
      }
    },
    generatePass() {
      let all = '';
      for(let contador = 0; contador <= this.configArray.length -1; contador++){
        all+=this.configArray[contador];
      }
      var password = '';
      let min = Math.ceil(8);
      let max = Math.floor(11);
      let size = Math.floor(Math.random() * (max - min)) + min;
      for (var index = 0; index < size; index++) {
        var character = Math.floor(Math.random() * all.length);
        password += all.substring(character, character + 1);
      }
      this.password = password;
    }
  },
  computed: {
    ...mapGetters([
      "getEditEntry"
    ])
  },
  mounted() {
    this.site = this.getEditEntry.serviceLink;
    this.service = this.getEditEntry.service;
    this.login = this.getEditEntry.login;
    this.password = this.getEditEntry.password;
  }
}
</script>

<style scoped>
.fields {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>