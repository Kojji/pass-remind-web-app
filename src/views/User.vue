<template>
  <div class="d-flex flex-column">
    <v-col
      cols="12"
      class="flex-grow-0 flex-shrink-0"
    >
      <v-btn text @click="deslogar">Sair</v-btn>
      <v-card
        class="pa-2"
        outlined
        tile
      >
        Página do Usuário para configurações
      </v-card>
    </v-col>
  </div>
</template>

<script>
export default {
  name: "User",
  methods: {
    deslogar() {
      if(confirm("Tem certeza que deseja sair do sistema?")) {
        this.$store.dispatch('userLogoff')
          .then(()=>{
            this.$router.push('/login')
          })
      }
    }
  }
}
</script>