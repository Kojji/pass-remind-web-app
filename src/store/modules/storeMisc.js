const state = {
  loading: false
}

const mutations = {
  setLoading(state, userData) { state.loading = userData}
}

const actions = {
}

const getters ={
  getLoading(state) { return state.loading }
}

export default {
  state,
  mutations,
  actions,
  getters
}