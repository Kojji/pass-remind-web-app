<template>
  <v-container>
    <v-card class="mx-auto" max-width="1020">
      <v-card-actions>
        <v-row justify-self="center" class="pa-4" >
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
            class="ml-3 mt-1"
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
                    <v-list-item-content class="align-start">{{ entry.serviceLink }}</v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="align-start">{{ entry.login }}</v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="align-start">
                      <v-text-field
                        class="passCard"
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
    
    <editEntry v-model="openEdit" :toEdit="editItemDialog"/>
    <addNewEntry v-model="addNewDialog" />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import addNewEntry from "../components/AddNewEntry"
import editEntry from "../components/EditEntry"

export default {
  components:{
    addNewEntry,
    editEntry
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
      "toolBarIcons"
    ])
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
    }
  }
}
</script>

<style>
.v-text-field.passCard > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.v-text-field.passCard > .v-input__control > .v-input__slot:after {
  border-style: none;
}
</style>