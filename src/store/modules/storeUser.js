import firebase from "firebase"
import router from '../../router'

const state = {
  logged: false,
  userId: null,
  userData: {displayName :null},
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
}

const actions = {
  userLogin({commit}, userData) {
    var firestoreDB = firebase.firestore();
    return new Promise ((res, rej) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(()=>{
        firebase.auth().signInWithEmailAndPassword(userData.login, userData.password)
        .then(result => {
          commit("logUser")
          commit("userId", result.user.uid)
          firestoreDB.collection("users").doc(result.user.uid).get()
          .then(doc => {
            commit("setUserData", doc.data())
          })
          router.push('/'); 
          res()
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          rej('err1')
        })
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        rej()
      })
    })
  },
  userLogoff({commit}) {
    return new Promise ((res, rej) => {
      firebase.auth().signOut().then(function() {
        commit("logoffUser")
        commit("setUserData", {displayName :null})
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
          })
          res(true)
        } else {
          res(false)
        }
      })
    })
  },
  // eslint-disable-next-line
  storeGoogleLogin({commit,dispatch}) {
    var firestoreDB = firebase.firestore();
    return new Promise((resolve, reject) => {
      let errorMessage = null;
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(result => {
          // eslint-disable-next-line
          console.log(result)
          commit("logUser")
          commit('userId', result.user.uid)
          firestoreDB.collection("users").doc(result.user.uid).get()
          .then(doc => {
            let infoObj = {}
            if(!doc.exists) {
              infoObj = {
                displayName: result.user.displayName,
                email: result.user.email,
                phoneNumber: result.user.phoneNumber,
                photoURL: result.user.photoURL,
                uid: result.user.uid,
                providerId: result.additionalUserInfo.providerId
              }
              firestoreDB.collection("users").doc(result.user.uid).set(infoObj)
              commit("setUserData", infoObj)
            } else {
              commit("setUserData", doc.data())
            }
          })
          
          //localStorage.setItem('userInfo', JSON.stringify(dataObj));
          router.push('/'); 
          resolve();
        })
        .catch(error => {
          errorMessage = error;
        });
      }).catch(err=>{
        errorMessage = err;
      });
      if(errorMessage === null) resolve();
      else reject(errorMessage);
    })
  },
  userSignIn({commit},userData) {
    var firestoreDB = firebase.firestore();
    firebase.auth().createUserWithEmailAndPassword(userData.login, userData.password)
    .then(result => {
      // eslint-disable-next-line
      console.log(result)
      commit("logUser")
      commit('userId', result.user.uid)
      let infoObj = {
        displayName: '',
        email: userData.login,
        phoneNumber: null,
        photoURL: null,
        uid: result.user.uid,
        providerId: result.additionalUserInfo.providerId
      }
      firestoreDB.collection("users").doc(result.user.uid).set(infoObj)
      commit("setUserData", infoObj)
      router.push('/')
    }).catch(error => {
      // eslint-disable-next-line
      console.log(error)
    });
  }
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