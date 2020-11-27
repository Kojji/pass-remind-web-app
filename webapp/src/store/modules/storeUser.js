import firebase from "firebase"
import router from '../../router'
import {v4 as uuidv4} from "uuid";

const state = {
  logged: false,
  userId: null,
  userData: {displayName :null},
  editUser: {},
}

const mutations = {
  logUser(state) { state.logged = true },
  logoffUser(state) { 
    state.logged = false
    state.userId = null
    state.userData = {userName :null}
  },
  userId(state, userData) { state.userId = userData},
  setUserData(state, userData) {state.userData = userData},
  setEditUser(state, userData) {state.editUser = userData},
  setEditUserByField(state, userData) { state.editUser[userData.field] = userData.value},
}

const actions = {
  changePassword({commit}, userData) {
    let auth = firebase.auth()
    return new Promise ((res, rej) => {
      auth.sendPasswordResetEmail(userData).then(function() {
        commit("setSnackOn",{color: "success", text: "E-mail de redefinição de senha enviado!"})
        res()
      }).catch(function() {
        commit("setSnackOn",{color: "red", text: "Erro ao tentar enviar o email de redefinição de senha!"})
        rej()
      });
    })
  },
  userLogin({commit}, userData) {
    var firestoreDB = firebase.firestore();
    return new Promise ((res, rej) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(()=>{
        firebase.auth().signInWithEmailAndPassword(userData.login, userData.password)
        .then(result => {
          commit("logUser")
          commit("userId", result.user.uid)
          firestoreDB.collection("users").doc(result.user.uid).get()
          .then(doc => {
            commit("setUserData", doc.data());
            commit("setEditUser", doc.data());
          })
          router.push('/'); 
          res();
        }).catch(() => {
          rej('err1');
        })
      }).catch(() => {
        rej();
      })
    })
  },
  userLogoff({commit}) {
    return new Promise ((res, rej) => {
      firebase.auth().signOut().then(function() {
        commit("logoffUser")
        commit("setUserData", {displayName :null})
        commit("setEditUser", {displayName :null})
        res()
      }).catch(function(error) {
        rej(error)
      });
    })
  },
  doAuthCheck({commit}) {
    var firestoreDB = firebase.firestore();
    // eslint-disable-next-line
    return new Promise((res, rej)=>{
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          commit("logUser")
          commit('userId', user.uid)
          firestoreDB.collection("users").doc(user.uid).get()
          .then(doc => {
            commit("setUserData", doc.data())
            commit("setEditUser", doc.data())
            res(true)
          }).catch(()=>{
            res(false)
          })
        } else {
          res(false)
        }
      })
    })
  },
  // eslint-disable-next-line
  // storeGoogleLogin({commit,dispatch}) {
  //   var firestoreDB = firebase.firestore();
  //   return new Promise((resolve, reject) => {
  //     let errorMessage = null;
  //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  //     .then(()=>{
  //       var provider = new firebase.auth.GoogleAuthProvider();
  //       firebase.auth().signInWithPopup(provider)
  //       .then(result => {
  //         // eslint-disable-next-line
  //         console.log(result)
  //         commit("logUser")
  //         commit('userId', result.user.uid)
  //         firestoreDB.collection("users").doc(result.user.uid).get()
  //         .then(doc => {
  //           let infoObj = {}
  //           if(!doc.exists) {
  //             infoObj = {
  //               displayName: result.user.displayName,
  //               email: result.user.email,
  //               phoneNumber: result.user.phoneNumber,
  //               photoURL: result.user.photoURL,
  //               uid: result.user.uid,
  //               providerId: result.additionalUserInfo.providerId
  //             }
  //             firestoreDB.collection("users").doc(result.user.uid).set(infoObj)
  //             commit("setUserData", infoObj)
  //             commit("setEditUser", infoObj)
  //           } else {
  //             commit("setUserData", doc.data())
  //             commit("setEditUser", doc.data())
  //           }
  //         })
          
  //         //localStorage.setItem('userInfo', JSON.stringify(dataObj));
  //         router.push('/'); 
  //         resolve();
  //       })
  //       .catch(error => {
  //         errorMessage = error;
  //       });
  //     }).catch(err=>{
  //       errorMessage = err;
  //     });
  //     if(errorMessage === null) resolve();
  //     else reject(errorMessage);
  //   })
  // },
  editUserInfo({state, commit}, userData) {
    return new Promise ((res,rej) => {
      var firestoreDB = firebase.firestore();
      firestoreDB.collection('users').doc(state.userId)
      .set(userData)
        .then(()=>{
          commit('setUserData', userData);
          res()
        }).catch(()=> {
          rej()
        })
    })
  },
  userSignIn({commit},userData) {
    var firestoreDB = firebase.firestore();
    return new Promise((resolve, reject) =>{
      firebase.auth().createUserWithEmailAndPassword(userData.login, userData.password)
      .then(result => {
        commit("logUser")
        commit('userId', result.user.uid)
        let infoObj = {
          displayName: userData.nome,
          email: userData.login,
          phoneNumber: null,
          photoURL: null,
          uid: result.user.uid,
          providerId: result.additionalUserInfo.providerId
        }
        firestoreDB.collection("users").doc(result.user.uid).set(infoObj)
        commit("setUserData", infoObj);
        commit("setEditUser", infoObj);
        resolve();
      }).catch(error => {
        reject(error.code);
      });
    })
  },
  // eslint-disable-next-line
  confirmOldPassword({getters}, userData){
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email,
        userData
      );

      user.reauthenticateWithCredential(credential).then(() => {
        resolve();
      }).catch((error)=>{
        error.code == "auth/wrong-password" ? reject(true) : reject(false); 
      });
    })
  },
  // eslint-disable-next-line
  changePasswordLogged({getters}, userData) {
    return new Promise((resolve, reject)=>{
      firebase.auth().currentUser.updatePassword(userData)
        .then(()=>{
          resolve();
        }).catch(()=>{
          reject();
        })
    })
  },
  registerFoto({getters, commit}, userData) {
    var storage = firebase.storage();
    var firestoreDB = firebase.firestore();
      return new Promise((resolve, reject) => {
        let fileRefName = "images/" + uuidv4() + "." + userData.name.split('.')[1];
        let fileRef = storage.ref().child(fileRefName);
        fileRef.put(userData)
          .then(() => {
            storage.ref(fileRefName).getDownloadURL()
              .then((url)=>{
                let userObj = JSON.parse(JSON.stringify(getters.editUser));
                  userObj.photoURL = url;
                  firestoreDB.collection("users").doc(userObj.uid).set(userObj)
                    .then(()=>{
                      commit("setUserData", userObj);
                      commit("setEditUser", userObj);
                      resolve();
                    }).catch(()=>{
                      reject();
                    })
              }).catch((error)=>{
                // eslint-disable-next-line
                console.log(error);
                reject();
              })
          }).catch((err) => {
            // eslint-disable-next-line
            console.log(err)
            reject();
          })
      });
  }
}

const getters = {
  logged(state) { return state.logged },
  userId(state) { return state.userId },
  userData(state) { return state.userData },
  editUser(state) { return state.editUser },
}

export default {
  state,
  mutations,
  actions,
  getters
}