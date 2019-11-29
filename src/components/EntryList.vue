<template>
  <div>
    <v-card class="mx-auto" max-width="860">
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          solo-inverted
          prepend-inner-icon="mdi-magnify"
          label="Procurar"
        ></v-text-field>
      </v-card-title>
      <v-data-iterator
        :items="registriesArray"
        :items-per-page.sync="itemsPerPage"
        :footer-props="footerProps"
        :search="search"
      >
        <template v-slot:default="props">
          <v-row 
            no-gutters
          >
            <v-col
              v-for="entry in props.items"
              :key="entry.id"
              cols="12"
              class="mt-2"
            >
              <v-card
                @click="editItem(entry)"
              >
                <v-row>
                  <v-col class="pl-5" md="4" sm="7" align-self="center">
                    <span >{{ entry.login }}</span>
                  </v-col>
                  <v-col md="3" sm="5" align-self="center">
                    {{ entry.password }}
                  </v-col>
                  <v-col md="3" sm="6" align-self="center">
                    {{ entry.service }}
                  </v-col>
                  <v-col md="2" sm="6">
                    <v-btn text rounded @click.stop="deleteItem(entry)" color="pink"><v-icon>mdi-delete</v-icon></v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
    <v-dialog v-model="openEdit" max-width="580">
      <v-card class="mx-auto">
        <v-card-title>Editar Senha</v-card-title>
        <v-card-text>
          <v-row>
            <v-col xs="12" sm="6">
              <v-text-field
                v-model="editItemDialog.login"
                label="Login"
                required
              ></v-text-field>
              <v-text-field
                append-icon="mdi-key"
                @click:append.stop="passwordGenerator"
                v-model="editItemDialog.password"
                label="Senha"
                required
              ></v-text-field>
              <v-text-field
                v-model="editItemDialog.service"
                label="Serviço"
                required
              ></v-text-field>
            </v-col>
            <v-col sm="6" class="d-none d-sm-flex">
              <v-row>
                <v-col cols="12">
                  <v-slider
                    v-model="passLength"
                    :max="maxLength"
                    :min="minLength"
                    thumb-color="orange lighten-1"
                    color="orange lighten-1"
                    thumb-label="always"
                    label="Tamanho"
                  ></v-slider>
                  <v-checkbox color="orange lighten-2" class="ma-0"  v-model="configArray" label="Uppercase Letters" value="ABCDEFGHIJKLMNOPQRSTUVWXYZ"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Lowercase Letters" value="abcdefghijklmnopqrstuvwxyz"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Numbers" value="0123456789"></v-checkbox>
                  <v-checkbox color="orange lighten-2" class="ma-0" v-model="configArray" label="Symbols" value=" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~"></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red darken-1" @click="closeEditDialog">Cancel</v-btn>
          <v-btn text color="green darken-1" @click="saveEditEntry">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      itemsPerPage: 10,
      footerProps: {
        itemsPerPageOptions: [5,10,20,-1],
        itemsPerPageText: 'Itens por página'
      },
      editItemDialog: {
        password: null
      },
      search: '',
      openEdit: false,
      passLength: 15,
      configArray: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz', '0123456789', ' !#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'],
      minLength: 5,
      maxLength: 30
    };
  },
  computed: {
    ...mapGetters([
      "registriesArray",
      "userData",
    ])
  },
  mounted() {
    if(this.userData !== null)
    this.$store.dispatch('getUserList', this.userData)
  },
  methods: {
    editItem(entry) {
      this.openEdit = true
      Object.assign(this.editItemDialog,entry)
    },
    deleteItem(entry) {
      if(confirm("Você está prestes a deletar uma senha, deseja continuar?")) this.$store.dispatch('deleteEntry', entry)
    },
    saveEditEntry() {
      this.$store.dispatch('verifyIfExist', this.editItemDialog)
      .then(()=>{
        this.editItemDialog.dateStamp = new Date().getTime()
        this.$store.dispatch('editEntry', this.editItemDialog)
        this.closeEditDialog()
      }).catch(()=>{
        alert("Já há um registro existente com o mesmo login e mesmo serviço ao qual você está tentando editar. Modifique um dos campos deste registro ou edite o registro existente")
      })

    },
    closeEditDialog() {
      this.openEdit = false
      this.editItemDialog = { password: null }
    },
    passwordGenerator() {
      let all = '';
      for(let contador = 0; contador <= this.configArray.length -1; contador++){
        all+=this.configArray[contador];
      }
      var password = '';
      for (var index = 0; index < this.passLength; index++) {
          var character = Math.floor(Math.random() * all.length);
          password += all.substring(character, character + 1);
      }
      this.editItemDialog.password = password;
    }
  }
}
</script>