import axios from 'axios'

const state = {
  registriesArray: []
}

const mutations = {
  setRegistriesArray(state, userData) { state.registriesArray = userData }
}

const actions = {
  getUserList({commit}, userData) {
    axios.get(`http://localhost:3000/registry?userId=${userData.id}`)
    .then((data) => {
      commit("setRegistriesArray", data.data)
    })
  }
}

const getters ={
  registriesArray(state) { return state.registriesArray }
}

export default {
  state,
  mutations,
  actions,
  getters
}