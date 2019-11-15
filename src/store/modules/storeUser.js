import Axios from "axios"

const state = {
  logged: false,
  userId: null,
  userData: null,
}
const mutations = {
  logUser(state) { state.logged = true },
  logoffUser(state) { 
    state.logged = false
    state.userId = null
    state.userData = null
  },
  userId(state, userData) { state.userId = userData},
  setUserData(state, userData) {state.userData = userData}
}
const actions = {
  userLogin({commit}, loginData) {
    return new Promise ((res, rej) => {
      Axios.get('http://localhost:3000/login')
        .then((loginArray)=>{
          loginArray.data.forEach(element => {
            if(loginData.login === element.login && loginData.password === element.password) {
              commit("logUser")
              commit('userId', element.id)
              res()
            }
          })
          if(!this.logged) {
            rej('err1') // erro ao não encontrar a conta
          }
        }).catch (()=>{
          rej('err2') // erro ao se comunicar com servidor
        })
    })
  },
  userLogoff({commit}) {
    // eslint-disable-next-line
    return new Promise ((res, rej) => {
      commit("logoffUser")
      res()
    })
  },
  getUserInfo({commit, state}) {
    return new Promise ((res, rej) => {
      Axios.get(`http://localhost:3000/users?loginId=${state.userId}`)
      .then((data) => {
        commit("setUserData", data.data)
        
        res()
      }).catch((err) =>{
        // eslint-disable-next-line
        console.log(err)
        rej()
      })
    })
  },
}
const getters = {
  logged(state) { return state.logged },
  userId(state) { return state.userId },
  userData(state) { return state.userData }
}
export default {
  state,
  mutations,
  actions,
  getters
}