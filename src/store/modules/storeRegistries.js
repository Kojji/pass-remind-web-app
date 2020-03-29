import axios from 'axios'
import storeUser from './storeUser'
import firebase from 'firebase'

const state = {
  registriesArray: []
}

const mutations = {
  setRegistriesArray(state, userData) { state.registriesArray = userData }
}

const actions = {
  getUserList({commit}) {
    var firestoreDB = firebase.firestore();
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').get()
    .then(querySnapshot => {
      if(querySnapshot.docs.length > 0) {
        let entriesArray = []
        querySnapshot.forEach(doc => {
          entriesArray.push(doc.data())
        })
        commit("setRegistriesArray", entriesArray)
      } else {
        commit("setRegistriesArray", [])
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log("Error getting documents: ", error);
    });
  },
  saveNewEntry({dispatch},userData) {
    var firestoreDB = firebase.firestore();
    let timestamp = new Date().getTime()
    let newObject = Object.assign(userData,{dateStamp: timestamp})
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.service)
    .set(newObject)
    dispatch('getUserList')
  },
  deleteEntry({dispatch}, userData) {
    var firestoreDB = firebase.firestore();
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.service)
    .delete()
    .then(() => {
      dispatch('getUserList')
    }).catch((err)=>{
      alert("Houve um erro ao tentar deletar uma senha, por favor tente novamente mais tarde.")
      // eslint-disable-next-line
      console.log(err)
    })
  },
  editEntry({dispatch}, userData) {
    axios.patch(`http://localhost:3000/registry/${userData.id}`, userData)
    .then(()=>{
      dispatch('getUserList')
    }).catch((err)=>{
      alert("Houve um erro ao tentar modificar uma senha, por favor tente novamente mais tarde.")
      // eslint-disable-next-line
      console.log(err)
    })
  },
  verifyIfExistNew({state}, userData) { // modificar
    return new Promise ((res,rej) => {
      state.registriesArray.forEach( entry => {
        if(entry.service == userData.service) {
          rej()
        }
      })
      res()
    })
  },
  verifyIfExistEdit({state}, userData) {
    return new Promise ((res,rej) => {
      state.registriesArray.find(obj=>{
        if(obj.login == userData.login && obj.service == userData.service && obj.id != userData.id) {
          rej()
        }
      })
      res()
    })
  }
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