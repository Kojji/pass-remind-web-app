import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

import Entries from './modules/storeRegistries'
import ToolBarFunctions from './modules/storeToolbar'
import UserFunctions from './modules/storeUser'
import PassGenerator from './modules/storePassGenerator'
import Miscellaneous from  './modules/storeMisc'

import firebaseConfig from '../../firebaseConfig'

firebase.initializeApp(firebaseConfig)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    storeButtonLoading: false
  },
  mutations: {
    setStoreButtonLoading(state, userData) {
      state.storeButtonLoading = userData;
    }
  },
  actions: {
    
  },
  getters: {
    getStoreButtonLoading(state) { return state.storeButtonLoading; }
  },
  modules: {
    Entries,
    ToolBarFunctions,
    UserFunctions,
    PassGenerator,
    Miscellaneous,
  }
})
