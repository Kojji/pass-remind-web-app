<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="1020" v-show="!getLoading">
      <v-card-actions>
        <v-row justify-self="center">
          <v-text-field
            v-model="search"
            clearable
            solo-inverted
            prepend-inner-icon="mdi-magnify"
            label="Procurar"
          ></v-text-field>
          <v-btn 
            fab
            small
            rounded
            class="ml-3 mt-1 d-none d-sm-flex"
            dark
            color="orange darken-1"
            @click="addEntry"
          >
            <v-icon>{{ toolBarIcons.addIcon }}</v-icon>
          </v-btn>
        </v-row>
      </v-card-actions>
      <v-data-iterator
        :items="registriesArray"
        :items-per-page.sync="itemsPerPage"
        :footer-props="footerProps"
        :search="search"
      >
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="entry in props.items"
              :key="entry.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                @click="editItem(entry)"
              >
                <v-card-title class="subheading font-weight-bold">{{ entry.service }}</v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item>
                    <v-list-item-content class="align-start">
                      <v-text-field
                        class="passCard py-0 mt-0"
                        :value="entry.serviceLink"
                        append-icon="mdi-web"
                        @click:append.stop="goto(entry.serviceLink)">
                      </v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="align-start">{{ entry.login }}</v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="align-start">
                      <v-text-field
                        class="passCard py-0 mt-0"
                        type="password"
                        :value="entry.password"
                        append-icon="mdi-content-copy"
                        @click:append.stop="copyPassword(entry.password)">
                      </v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
    <div style="position: fixed; bottom:65px; left:20px;">
      <v-btn
        fab
        rounded
        right
        class="ml-3 mt-1 d-flex d-sm-none" 
        dark
        color="orange darken-1"
        @click="addEntry"
      >
        <v-icon>{{ toolBarIcons.addIcon }}</v-icon>
      </v-btn>
    </div>

    <div class="text-center" v-show="getLoading">
      <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
      color="deep-orange lighten-1"
      ></v-progress-circular>
    </div>
    
    <editEntry v-model="openEdit" :toEdit="editItemDialog"/>
    <addNewEntry v-model="addNewDialog" />
    <snack v-model="getShowSnack" />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import addNewEntry from "../components/AddNewEntry"
import editEntry from "../components/EditEntry"
import snack from "../components/Snack"

export default {
  components:{
    addNewEntry,
    editEntry,
    snack
  },
  data() {
    return {
      itemsPerPage: 8,
      footerProps: {
        itemsPerPageOptions: [6,8,12,18,-1],
        itemsPerPageText: 'Itens por página'
      },
      editItemDialog: {
        password: null
      },
      search: '',
      openEdit: false,
      newItem:{},
      addNewDialog: false,
    };
  },
  computed: {
    ...mapGetters([
      "registriesArray",
      "userData",
      "toolBarIcons",
      "getLoading",
      "getKey",
    ]),
    getShowSnack: {
      get () {
        return this.$store.getters.getShowSnack
      },
      set (value) {
        if(!value) {
          this.$store.commit('setSnackOff')
        }
      }
    }
  },
  mounted() {
    if(this.userData !== null)
    this.$store.dispatch('getUserList')
  },
  methods: {
    copyPassword(password) {
      var clipboard = document.createElement('textarea')
      clipboard.value = password
      clipboard.setAttribute('readonly', '')
      clipboard.style = {position: 'absolute', left: '-9999px'}
      document.body.appendChild(clipboard)
      clipboard.select()
      document.execCommand('copy')
      document.body.removeChild(clipboard)
      alert("senha copiada")
      //avisar que foi copiado
    },
    addEntry() {
      this.addNewDialog = true
    },
    editItem(entry) {
      Object.assign(this.editItemDialog,entry)
      this.openEdit = true
    },
    goto(url) {
      window.open(url)
    },
  }
}
</script>

<style>
.v-text-field.passCard > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.v-input__slot{
  margin-bottom: 0;
}
.v-text-field.passCard > .v-input__control > .v-input__slot:after {
  border-style: none;
}
</style>