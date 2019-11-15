import Vue from 'vue'
import Vuex from 'vuex'

import Entries from './modules/entries'
import EntryListModel from './modules/entryListModel'
import ToolBarFunctions from './modules/storeToolbar'
import UserFunctions from './modules/storeUser'

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
    EntryListModel,
    ToolBarFunctions,
    UserFunctions,
  }
})
