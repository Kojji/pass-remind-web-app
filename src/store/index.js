import Vue from 'vue'
import Vuex from 'vuex'

import Entries from './modules/storeRegistries'
import ToolBarFunctions from './modules/storeToolbar'
import UserFunctions from './modules/storeUser'
import PassGenerator from './modules/storePassGenerator'

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
