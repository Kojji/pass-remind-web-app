<template>
  <div id="popup">
    <div>
      <p>Site: {{getPageURL}}</p>
      <hr>
      <div v-if="getUserDocs.length > 0">
        <p>Nome: {{getUserDocs[counter - 1].service}}</p>
        <p>Login: {{getUserDocs[counter - 1].login}}</p>
        <div class="input-container">
          <label for="password">Senha:</label>
          <input type="password" style="margin-bottom: 5px;" disabled :value="getUserDocs[counter - 1].password" />
          <p @click="clipboard(counter - 1)" class="icon" style="height: auto; cursor: pointer;">{{copyText}}</p>
        </div>
        <button @click="previous">&#171;</button>
        <span>{{counter}}/{{getUserDocs.length}}</span>
        <button @click="next">&#187;</button>
        <button @click="editar">Editar</button>
        <br>
      </div>
      <div v-else>
        <p>Não há nenhuma senha registrada para este site</p>
      </div>
      <div style="margin-top: 5px;">
        <hr>
        <button @click="criarSenha">Criar Senha</button>
        <button @click="logout">Logout</button>
        <button @click="redirect">Site</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      counter: 1,
      copyText: "copiar"
    };
  },
  computed: {
    ...mapGetters([
      "getUserDocs",
      "getPageURL"
    ])
  },
  methods: {
    previous() {
      this.counter - 1 < 1 ? this.counter = this.getUserDocs.length : this.counter--;
    },
    next() {
      this.counter + 1 > this.getUserDocs.length ? this.counter = 1 : this.counter++;
    },
    redirect() {
      window.open("https://passremind-231.web.app/",'_blank');
    },
    clipboard(index) {
      var clipboard = document.createElement('textarea');
      clipboard.value =this.getUserDocs[index].password;
      clipboard.setAttribute('readonly', '');
      clipboard.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(clipboard);
      clipboard.select();
      document.execCommand('copy');
      document.body.removeChild(clipboard);
      this.copyText = "copiado";
    },
    criarSenha() {
      this.$router.push("/criar-senha");
    },
    editar() {
      this.$store.commit("setEditEntry", this.getUserDocs[this.counter - 1]);
      this.$router.push("/editar-senha");
    },
    logout() {
      this.$store.commit('setLoading', true)
      this.$store.dispatch('logout')
        .then((res)=>{
          this.$router.push("/");
        }).finally(()=>{
          this.$store.commit('setLoading', false)
        })
    },
    
  },
  mounted() {
    this.$store.commit('setLoading', true);
    this.$store.dispatch('queryDocsUser')
    .finally(()=>{
      this.$store.commit('setLoading', false);
    })
  }
};
</script>

<style scoped>

.input-container {
  display: flex;
  width: 100%;
}

.icon {
  position: absolute;
  margin-top: 2px;
  right: 20px;
  background: white;
  text-align: center;
}

</style>
