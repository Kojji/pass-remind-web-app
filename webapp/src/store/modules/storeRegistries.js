import storeUser from './storeUser'
import storeMisc from './storeMisc'
import firebase from 'firebase'

const state = {
  registriesArray: [],
}

const mutations = {
  setRegistriesArray(state, userData) { state.registriesArray = userData },
}

const actions = {
  // eslint-disable-next-line
  getUserList({commit}) {
    storeMisc.mutations.setLoading(storeMisc.state, true)
    var docCollection = firebase.functions().httpsCallable('readDoc');
    return new Promise ((res, rej) =>{
      docCollection()
        .then((result) => {
          commit("setRegistriesArray", result.data)
          res()
        }).catch((err)=>{
          rej(err)
        }).finally(()=>{
          storeMisc.mutations.setLoading(storeMisc.state, false)
        })
    })
  },
  saveNewEntry({dispatch},userData) {
    var newDoc = firebase.functions().httpsCallable('writeDoc');
    userData.timestamp = new Date().getTime();
    return new Promise ((res, rej) =>{
      newDoc(userData)
        .then(() => {
          dispatch('getUserList')
          res()
        }).catch((err)=>{
          rej(err)
        })
    })
  },
  deleteEntry({dispatch}, userData) {
    var firestoreDB = firebase.firestore();
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.service)
    .delete()
    .then(() => {
      dispatch('getUserList')
    }).catch((err)=>{
      // eslint-disable-next-line
      console.log(err)
    })
  },
  editEntry({dispatch}, userData) {
    var updateDoc = firebase.functions().httpsCallable('updateDoc');
    return new Promise ((res, rej) =>{
      updateDoc(userData)
        .then(() => {
          dispatch('getUserList')
          res()
        }).catch((err)=>{
          rej(err)
        })
    })
  },
  verifyIfExistNew({state}, userData) { // modificar
    return new Promise ((res,rej) => {
      state.registriesArray.forEach( entry => {
        if(entry.service.toUpperCase() == userData.service.toUpperCase()) {
          rej()
        }
      })
      res()
    })
  },
  verifyIfExistEdit({state}, userData) {
    return new Promise ((res,rej) => {
      if(userData.old.service.toUpperCase() === userData.new.service.toUpperCase()) {
        res()
      } else{
        state.registriesArray.forEach( entry => {
          if(entry.service.toUpperCase() === userData.new.service.toUpperCase()) {
            rej()
          }
        })
        res()
      }
    })
  },
}

const getters ={
  registriesArray(state) { return state.registriesArray },
}

export default {
  state,
  mutations,
  actions,
  getters
}