const state = {
  entryListHeaders: [
    {text: "Login", sortable: false, value: 'login'},
    {text: "Service", sortable: false, value: 'service'},
    {text: "Password", sortable: false, value: 'password'},
  ]
}

const mutations = {

}

const actions = {

}

const getters ={
  entryListHeaders(state) {
    return state.entryListHeaders
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}