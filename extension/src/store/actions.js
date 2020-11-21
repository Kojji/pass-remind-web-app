import firebase from 'firebase'
import SimpleCrypto from "simple-crypto-js";
import {ENC} from '../../global'
//let seed = new SimpleCrypto(ENC)
let crypto = new SimpleCrypto(ENC)
function decrypt(registry) {
  return new Promise((res, rej)=>{
    let simpleCrypto = crypto
    registry.password = simpleCrypto.decrypt(registry.password);
    res(registry)
  })
}
function encrypt(registry) {
  return new Promise((res, rej)=>{
    let simpleCrypto = crypto
    registry.password = simpleCrypto.encrypt(registry.password);
    res(registry)
  })
}
export default {
  generateKey({}, userData) {
    return new Promise ((res,rej) => {
      let key = seed.encrypt(userData)
      crypto = new SimpleCrypto(key)
      res()
    })
  },
  resetKey({}) {
    crypto = null
  },
  emailLogin({state, commit}, userData) {
    var firestoreDB = firebase.firestore();
    return new Promise ((res, rej) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(()=>{
        firebase.auth().signInWithEmailAndPassword(userData.login, userData.password)
        .then(result => {
          commit('setLogged', true);
          commit("setUser", result.user);
          firestoreDB
            .collection("users")
            .doc(result.user.uid)
            .collection('entries')
            .where("serviceLink", "==", state.pageURL)
            .get()
              .then(querySnapshot => {
                if(querySnapshot.docs.length > 0) {
                  let entriesArray = []
                  querySnapshot.forEach(doc => {
                    decrypt(doc.data()).then((decrypted)=>{
                      entriesArray.push(decrypted)
                    })
                  })
                  commit("setUserDocs", entriesArray)
                } else {
                  commit("setUserDocs", [])
                }
              })
          res(result)
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error);
          rej('err1');
        })
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error);
        rej();
      })
    })
  },
  queryDocsUser({state, commit}) {
    var firestoreDB = firebase.firestore();
    return new Promise ((res, rej) => {
      firestoreDB
        .collection("users")
        .doc(state.user.uid)
        .collection('entries')
        .where("serviceLink", "==", state.pageURL)
        .get()
          .then(querySnapshot => {
            if(querySnapshot.docs.length > 0) {
              let entriesArray = [];
              querySnapshot.forEach(doc => {
                decrypt(doc.data()).then((decrypted)=>{
                  entriesArray.push(decrypted);
                })
              })
              commit("setUserDocs", entriesArray);
            } else {
              commit("setUserDocs", []);
            }
          }).finally(()=>{
            res();
          })
    })
  },
  doAuthCheck({commit}) {
    return new Promise((res, rej)=>{
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          commit("setUser", user);
          commit("setLogged", true);
          res(true);
        } else {
          res(false);
        }
      })
    })
  },
  logout({commit}) {
    return new Promise ((res, rej) => {
      firebase.auth().signOut().then(function() {
        commit("setLogged", false);
        commit("setUser", {displayName :null});
        commit("setUserDocs", []);
        res()
      }).catch(function(error) {
        rej(error)
      });
    })
  },
  storeGoogleLogin({state, commit}) {
    var firestoreDB = firebase.firestore();
    return new Promise((res, rej) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider)
        .then(result => {
          commit("setLogged", true);
          commit('setUser', result.user)
          firestoreDB
            .collection("users")
            .doc(result.user.uid)
            .collection('entries')
            .where("serviceLink", "==", state.pageURL)
            .get()
              .then(querySnapshot => {
                if(querySnapshot.docs.length > 0) {
                  let entriesArray = []
                  querySnapshot.forEach(doc => {
                    decrypt(doc.data()).then((decrypted)=>{
                      entriesArray.push(decrypted)
                    })
                  })
                  commit("setUserDocs", entriesArray)
                } else {
                  commit("setUserDocs", [])
                }
              })
          res(result)
        })
        .catch(error => {
          rej();
        });
      }).catch(err=>{
        rej();
      });
    })
  },
  verifyIfExistEdit({state}, userData) {
    return new Promise ((res,rej) => {
      if(userData.old.service.toUpperCase() === userData.new.service.toUpperCase()) {
        res()
      } else{
        state.userDocs.forEach( entry => {
          if(entry.service.toUpperCase() === userData.new.service.toUpperCase()) {
            rej()
          }
        })
        res()
      }
    })
  },
  verifyIfExistNew({state}, userData) { // modificar
    return new Promise ((res,rej) => {
      state.userDocs.forEach( entry => {
        if(entry.login.toUpperCase() == userData.login.toUpperCase() || entry.service.toUpperCase() == userData.service.toUpperCase()) {
          rej()
        }
      })
      res()
    })
  },
  editEntry({state, dispatch}, userData) {
    return new Promise ((res,rej) => {
      var firestoreDB = firebase.firestore();
      if(userData.old.service.toUpperCase() !== userData.new.service.toUpperCase()) {
        let oldDoc = {}
        firestoreDB.collection("users").doc(state.user.uid).collection('entries').doc(userData.old.service).get()
        .then(doc => {
          Object.assign(oldDoc, doc.data())
        })
        encrypt(userData.new).then((encrypted) => {
          let renewed = Object.assign(oldDoc, encrypted)
          firestoreDB.collection("users").doc(state.user.uid).collection('entries').doc(userData.new.service)
          .set(renewed)
          .then(()=>{
            firestoreDB.collection("users").doc(state.user.uid).collection('entries').doc(userData.old.service)
            .delete()
            .then(()=>{
              dispatch('queryDocsUser')
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
          firestoreDB.collection('users').doc(state.user.uid).collection('entries').doc(userData.new.service)
          .set(encrypted)
          .then(()=>{
            dispatch('queryDocsUser')
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
  saveNewEntry({state,dispatch},userData) {
    return new Promise ((res,rej) => {
      var firestoreDB = firebase.firestore();
      let timestamp = new Date().getTime();
      encrypt(userData)
        .then((encrypted) => {
          let newObject = Object.assign(encrypted,{dateStamp: timestamp})
          firestoreDB.collection('users').doc(state.user.uid).collection('entries').doc(userData.service)
          .set(newObject).then(()=>{
            dispatch('queryDocsUser');
            res();
          }).catch(()=>{
            rej();
          })
        }).catch(()=>{
          rej();
        })
      })
  },
}
