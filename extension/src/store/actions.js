import firebase from 'firebase'
import simpleCrypto from "simple-crypto-js"

export default {
  emailLogin({state, commit}, userData) {
    return new Promise ((res, rej) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(()=>{
        firebase.auth().signInWithEmailAndPassword(userData.login, userData.password)
        .then(result => {
          commit('setLogged', true);
          commit("setUser", result.user);
          res(result)
        }).catch(() => {
          rej('err1');
        })
      }).catch(() => {
        rej();
      })
    })
  },
  queryDocsUser({getters, commit}) {
    var firebaseDB = firebase.firestore();
    return new Promise ((res, rej) => {
      if(getters.getKey == "") {
        var functionRef = firebase.functions().httpsCallable("getPassEnc");
        functionRef()
          .then((resp)=>{
            commit("setKey", resp.data);
            let simpleEnc = new simpleCrypto(resp.data);
            firebaseDB.collection("users").doc(getters.getUser.uid).collection('entries').where("serviceLink", "==", getters.getPageURL).get()
              .then(querySnapshot => {
                if(querySnapshot.docs.length > 0) {
                  let entriesArray = [];
                  querySnapshot.forEach(item => {
                    let entry = item.data();
                    entry.password = simpleEnc.decrypt(entry.password);
                    entriesArray.push(entry);
                  })
                  commit("setUserDocs", entriesArray);
                } else {
                  commit("setUserDocs", []);
                }
              }).finally(()=>{
                res();
              })
          }).catch(()=>{
            rej();
          })
      } else {
        let simpleEnc = new simpleCrypto(getters.getKey);
        firebaseDB.collection("users").doc(getters.getUser.uid).collection('entries').where("serviceLink", "==", getters.getPageURL).get()
          .then(querySnapshot => {
            if(querySnapshot.docs.length > 0) {
              let entriesArray = [];
              querySnapshot.forEach(item => {
                let entry = item.data();
                entry.password = simpleEnc.decrypt(entry.password);
                entriesArray.push(entry);
              })
              commit("setUserDocs", entriesArray);
            } else {
              commit("setUserDocs", []);
            }
          }).finally(()=>{
            res();
          })
      }
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
  verifyIfExistEdit({getters}, userData) {
    return new Promise ((res,rej) => {
      if(userData.old.service.toUpperCase() === userData.new.service.toUpperCase()) {
        res()
      } else{
        getters.getUserDocs.forEach( entry => {
          if(entry.service.toUpperCase() === userData.new.service.toUpperCase()) {
            rej()
          }
        })
        res()
      }
    })
  },
  verifyIfExistNew({state}, userData) {
    return new Promise ((res,rej) => {
      state.userDocs.forEach( entry => {
        if(entry.service.toUpperCase() == userData.service.toUpperCase()) {
          rej()
        }
      })
      res()
    })
  },
  editEntry({getters, dispatch}, userData) {
    let simpleEnc = new simpleCrypto(getters.getKey);
    var firebaseDB = firebase.firestore();
    return new Promise ((res,rej) => {
      let toSave = JSON.parse(JSON.stringify(userData.new));
      toSave.password = simpleEnc.encrypt(toSave.password);
      if(userData.old.service.toUpperCase() !== toSave.service.toUpperCase()) {
        var batch = firebaseDB.batch();
        var newRef = firebaseDB.collection('users').doc(getters.getUser.uid).collection('entries').doc(toSave.service);
        batch.set(newRef, toSave);
        var oldRef = firebaseDB.collection('users').doc(getters.getUser.uid).collection('entries').doc(userData.old.service);
        batch.delete(oldRef);
        batch.commit().then(function () {
          dispatch('queryDocsUser')
          res();
        }).catch((err)=>{
          rej(err);
        });
      } else {
        firebaseDB.collection('users').doc(getters.getUser.uid).collection('entries').doc(toSave.service)
          .set(toSave)
          .then(()=>{
            dispatch('queryDocsUser')
            res()
          }).catch(err => {
            rej(err)
          })
      }
    });
  },
  saveNewEntry({getters,dispatch},userData) {
    let simpleEnc = new simpleCrypto(getters.getKey);
    var firebaseDB = firebase.firestore();
    return new Promise((res, rej)=>{
      let toSave = JSON.parse(JSON.stringify(userData));
      toSave.password = simpleEnc.encrypt(toSave.password);
      toSave.dateStamp = new Date().getTime();
      firebaseDB.collection("users").doc(getters.getUser.uid).collection('entries').doc(userData.service).set(toSave)
        .then(()=>{
          dispatch('queryDocsUser');
          res()
        }).catch((err)=>{
          rej(err)
        })
    });
  },
}
