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
  },
  saveNewEntry({dispatch},userData) {
    let timestamp = new Date().getTime()
    let newObject = Object.assign(userData,{dateStamp: timestamp})
    axios.post(`http://localhost:3000/registry`, newObject)
    .then(()=>{
      dispatch('getUserList', {id: userData.userId})
    }).catch((err)=>{
      alert("Houve um erro ao tentar salvar uma nova senha, por favor tente novamente mais tarde.")
      // eslint-disable-next-line
      console.log(err)
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