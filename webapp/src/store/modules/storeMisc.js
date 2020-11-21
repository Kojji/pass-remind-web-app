const state = {
  loading: false,
  showSnack: false,
  snackText: {}
}

const mutations = {
  setLoading(state, userData) { state.loading = userData},
  setSnackOn(state, userData) { 
    state.showSnack = true
    state.snackText = userData 
  },
  setSnackOff(state) { 
    state.showSnack = false
    state.snackText = {}
  }
}

const actions = {
}

const getters ={
  getLoading(state) { return state.loading },
  getShowSnack(state) { return state.showSnack },
  getSnackText(state) { return state.snackText },
}

export default {
  state,
  mutations,
  actions,
  getters
}