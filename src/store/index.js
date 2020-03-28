import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

import Entries from './modules/storeRegistries'
import ToolBarFunctions from './modules/storeToolbar'
import UserFunctions from './modules/storeUser'
import PassGenerator from './modules/storePassGenerator'

import firebaseConfig from '../../firebaseConfig'

firebase.initializeApp(firebaseConfig)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Entries,
    ToolBarFunctions,
    UserFunctions,
    PassGenerator,
  }
})
