import storeUser from './storeUser'
import storeMisc from './storeMisc'
import firebase from 'firebase'
import SimpleCrypto from "simple-crypto-js";
import cryptoJs from "crypto-js";
import {ENC} from '../../../global'

const state = {
  registriesArray: [],
  crypto: new SimpleCrypto(ENC)
}

const mutations = {
  setRegistriesArray(state, userData) { state.registriesArray = userData },
  setCrypto(state, userData) { state.crypto = userData },
}

const actions = {
  getUserList({commit}) {
    storeMisc.mutations.setLoading(storeMisc.state, true)
    var firestoreDB = firebase.firestore();
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').get()
    .then(querySnapshot => {
      if(querySnapshot.docs.length > 0) {
        let entriesArray = []
        querySnapshot.forEach(doc => {
          decrypt(doc.data()).then((decrypted)=>{
            entriesArray.push(decrypted)
          })
        })
        commit("setRegistriesArray", entriesArray)
      } else {
        commit("setRegistriesArray", [])
      }
      storeMisc.mutations.setLoading(storeMisc.state, false)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log("Error getting documents: ", error);
      storeMisc.mutations.setLoading(storeMisc.state, false)
    });
  },
  saveNewEntry({dispatch},userData) {
    var firestoreDB = firebase.firestore();
    let timestamp = new Date().getTime()
    encrypt(userData).then((encrypted) => {
      let newObject = Object.assign(encrypted,{dateStamp: timestamp})
      firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.service)
      .set(newObject).then(()=>{
        storeMisc.mutations.setSnackOn(storeMisc.state,{color: "success", text: "Registro criado com sucesso!"})
      })
      dispatch('getUserList')
    })
  },
  deleteEntry({dispatch}, userData) {
    var firestoreDB = firebase.firestore();
    firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.service)
    .delete()
    .then(() => {
      storeMisc.mutations.setSnackOn(storeMisc.state,{color: "success", text: "Registro apagado com sucesso!"})
      dispatch('getUserList')
    }).catch((err)=>{
      alert("Houve um erro ao tentar deletar uma senha, por favor tente novamente mais tarde.")
      // eslint-disable-next-line
      console.log(err)
    })
  },
  editEntry({dispatch}, userData) {
    return new Promise ((res,rej) => {
      var firestoreDB = firebase.firestore();
      if(userData.old.service.toUpperCase() !== userData.new.service.toUpperCase()) {
        let oldDoc = {}
        firestoreDB.collection("users").doc(storeUser.state.userId).collection('entries').doc(userData.old.service).get()
        .then(doc => {
          Object.assign(oldDoc, doc.data())
        })
        encrypt(userData.new).then((encrypted) => {
          let renewed = Object.assign(oldDoc, encrypted)
          firestoreDB.collection("users").doc(storeUser.state.userId).collection('entries').doc(userData.new.service)
          .set(renewed)
          .then(()=>{
            firestoreDB.collection("users").doc(storeUser.state.userId).collection('entries').doc(userData.old.service)
            .delete()
            .then(()=>{
              storeMisc.mutations.setSnackOn(storeMisc.state,{color: "success", text: "Registro modificado com sucesso!"})
              dispatch('getUserList')
              res()
            })
          }).catch((err)=>{
            // eslint-disable-next-line
            console.log(err)
            rej()
          })
        })
      } else {
        encrypt(userData.new).then((encrypted)=> {
          firestoreDB.collection('users').doc(storeUser.state.userId).collection('entries').doc(userData.new.service)
          .set(encrypted)
          .then(()=>{
            storeMisc.mutations.setSnackOn(storeMisc.state,{color: "success", text: "Registro modificado com sucesso!"})
            dispatch('getUserList')
            res()
          }).catch(err => {
            rej()
            // eslint-disable-next-line
            console.log(err)
          })
        })
      }
    })
  },
  generateKey({commit}, userData) {
    // eslint-disable-next-line
    return new Promise ((res,rej) => {
      cryptoJs
      var hash = crypto.SHA256(userData.uid);
      var key128Bits = crypto.PBKDF2(userData.key, hash, {
        keySize: 128 / 32
      });
      commit('setCrypto', new SimpleCrypto(key128Bits.toString()))
      // eslint-disable-next-line
      console.log(key128Bits.toString())
      res(true)
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
  // eslint-disable-next-line
  readCollection({state}, userData) {
    var testeMessage = firebase.functions().httpsCallable('readDoc');
    return new Promise ((res, rej) =>{
      testeMessage({text: "teste1"})
        .then((result) => {
          res(result)
        }).catch((err)=>{
          rej(err)
        })
    })
  },
  // eslint-disable-next-line
  updateDoc({state}, userData) {
    var testeMessage = firebase.functions().httpsCallable('updateDoc');
    return new Promise ((res, rej) =>{
      testeMessage(userData)
        .then((result) => {
          res(result)
        }).catch((err)=>{
          rej(err)
        })
    })
  },
  // eslint-disable-next-line
  createDoc({state}, userData) {
    var newDoc = firebase.functions().httpsCallable('writeDoc');
    userData.timestamp = new Date().getTime();
    return new Promise ((res, rej) =>{
      newDoc(userData)
        .then((result) => {
          res(result)
        }).catch((err)=>{
          rej(err)
        })
    })
  }
}

function encrypt(registry) {
  // eslint-disable-next-line
  return new Promise((res, rej)=>{
    let simpleCrypto = state.crypto
    registry.password = simpleCrypto.encrypt(registry.password);
    res(registry)
  })
}

function decrypt(registry) {
  // eslint-disable-next-line
  return new Promise((res, rej)=>{
    let simpleCrypto = state.crypto
    registry.password = simpleCrypto.decrypt(registry.password);
    res(registry)
  })
}

const getters ={
  registriesArray(state) { return state.registriesArray },
  getCrypto(state) { return state.crypto },
}

export default {
  state,
  mutations,
  actions,
  getters
}