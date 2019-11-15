const state = {
  entriesArray: [
    {
      id: 1,
      login: "testeLogin(1)",
      password: "testePass(1)",
      service: "testeServ(1)"
    },
    {
      id: 2,
      login: "testeLogin(2)",
      password: "testePass(2)",
      service: "testeServ(2)"
    },
    {
      id: 3,
      login: "testeLogin(3)",
      password: "testePass(3)",
      service: "testeServ(3)"
    },
  ]
}

const mutations = {

}

const actions = {

}

const getters ={
  entriesArray(state) {
    return state.entriesArray
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}