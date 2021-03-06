import firebase from 'firebase'
//import crypto from "crypto-js";
import simpleCripto from "simple-crypto-js"

const state = {
  registriesArray: [],
  key: "",
}

const mutations = {
  setRegistriesArray(state, userData) { state.registriesArray = userData },
  setKey(state, userData) { state.key = userData },
}

const actions = {
  getUserList({commit, getters}) {
    return new Promise((res, rej) =>{
      var firebaseDB = firebase.firestore();
      commit("setLoading", true);
      if(getters.getKey == "") {
        var functionRef = firebase.functions().httpsCallable("getPassEnc");
        functionRef()
          .then((resp)=>{
            commit("setKey", resp.data);
            let simpleEnc = new simpleCripto(resp.data);
            firebaseDB.collection("users").doc(getters.userId).collection('entries').get()
              .then( querySnapshot => {
                let entryArray = [];
                if(querySnapshot.docs.length > 0) {
                  querySnapshot.forEach(item => {
                    let entry = item.data();
                    // var decrypted = crypto.AES.decrypt(entry.password, resp.data);
                    // entry.password = decrypted.toString(crypto.enc.Utf8);
                    entry.password = simpleEnc.decrypt(entry.password);
                    entryArray.push(entry);
                  })
                }
                commit("setRegistriesArray", entryArray);
                res();
              }).catch((err)=>{
                rej(err);
              })
          }).catch(()=>{
            rej();
          }).finally(()=>{
            commit("setLoading", false);
          })
      } else {
        let simpleEnc = new simpleCripto(getters.getKey);
        firebaseDB.collection("users").doc(getters.userId).collection('entries').get()
          .then( querySnapshot => {
            let entryArray = [];
            if(querySnapshot.docs.length > 0) {
              querySnapshot.forEach(item => {
                let entry = item.data();
                // var decrypted = crypto.AES.decrypt(entry.password, getters.getKey);
                // entry.password = decrypted.toString(crypto.enc.Utf8);
                entry.password = simpleEnc.decrypt(entry.password);
                entryArray.push(entry);
              })
            }
            commit("setRegistriesArray", entryArray);
            res();
          }).catch((err)=>{
            rej(err);
          }).finally(()=>{
            commit("setLoading", false);
          })
      }
    })
  },
  saveNewEntry({dispatch, getters},userData) {
    let simpleEnc = new simpleCripto(getters.getKey);
    var firebaseDB = firebase.firestore();
    return new Promise((res, rej)=>{
      let toSave = JSON.parse(JSON.stringify(userData));
      // let encrypted = crypto.AES.encrypt(userData.password, getters.getKey).toString();
      // toSave.password = encrypted;
      toSave.password = simpleEnc.encrypt(toSave.password);
      firebaseDB.collection("users").doc(getters.userId).collection('entries').doc(userData.service).set(toSave)
        .then(()=>{
          dispatch('getUserList')
          res()
        }).catch((err)=>{
          rej(err)
        })
    });
  },
  deleteEntry({dispatch, getters}, userData) {
    var firestoreDB = firebase.firestore();
    return new Promise((res, rej)=>{
      firestoreDB.collection('users').doc(getters.userId).collection('entries').doc(userData.service)
      .delete()
        .then(() => {
          dispatch('getUserList')
          res();
        }).catch((err)=>{
          rej(err);
        })
    })
  },
  editEntry({dispatch, getters}, userData) {
    let simpleEnc = new simpleCripto(getters.getKey);
    var firebaseDB = firebase.firestore();
    return new Promise((res, rej) => {
      let toSave = JSON.parse(JSON.stringify(userData.new));
      toSave.password = simpleEnc.encrypt(toSave.password);
      // let encrypted = crypto.AES.encrypt(userData.new.password, getters.getKey);
      // toSave.password = encrypted.toString();
      if(userData.old.service.toUpperCase() !== toSave.service.toUpperCase()) {
        var batch = firebaseDB.batch();
        var newRef = firebaseDB.collection('users').doc(getters.userId).collection('entries').doc(toSave.service);
        batch.set(newRef, toSave);
        var oldRef = firebaseDB.collection('users').doc(getters.userId).collection('entries').doc(userData.old.service);
        batch.delete(oldRef);
        batch.commit().then(function () {
          dispatch('getUserList')
          res();
        }).catch((err)=>{
          rej(err);
        });
      } else {
        firebaseDB.collection('users').doc(getters.userId).collection('entries').doc(toSave.service)
          .set(toSave)
          .then(()=>{
            dispatch('getUserList')
            res()
          }).catch(err => {
            rej(err)
          })
      }
    });
  },
  verifyIfExistNew({state}, userData) {
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
  getKey(state) { return state.key },
}

export default {
  state,
  mutations,
  actions,
  getters
}