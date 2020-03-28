import Axios from "axios"
import firebase from "firebase"
import router from '../../router'

const state = {
  logged: false,
  userId: null,
  userData: {userName :null},
}

const mutations = {
  logUser(state) { state.logged = true },
  logoffUser(state) { 
    state.logged = false
    state.userId = null
    state.userData = {userName :null}
  },
  userId(state, userData) { state.userId = userData},
  setUserData(state, userData) {state.userData = userData}
}

const actions = {
  userLogin({commit}, userData) {
    return new Promise ((res, rej) => {
      firebase.auth().signInWithEmailAndPassword(userData.login, userData.password)
      .then(result => {
        // eslint-disable-next-line
        console.log(result)
        commit("logUser")
        commit('userId', result.user.uid)
        router.push('/'); 
        res()
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
        res()
      }).catch(function(error) {
        rej(error)
      });
    })
  },
  getUserInfo({commit, state}) {
    return new Promise ((res, rej) => {
      Axios.get(`http://localhost:3000/users?loginId=${state.userId}`)
      .then((data) => {
        commit("setUserData", data.data[0])
        
        res()
      }).catch((err) =>{
        // eslint-disable-next-line
        console.log(err)
        rej()
      })
    })
  },
  // eslint-disable-next-line
  doAuthCheck({commit, state}) {
    // eslint-disable-next-line
    return new Promise((res, rej)=>{
      res()
    })
  },
  // eslint-disable-next-line
  storeGoogleLogin({commit,dispatch}) {
    return new Promise(async (resolve, reject) => {
      let errorMessage = null;
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // eslint-disable-next-line
          console.log(result)
          commit("logUser")
          commit('userId', result.user.uid)
          /* let dataObj = {
            displayName: result.user.providerData[0].displayName,
            email: result.user.providerData[0].email,
            phoneNumber: result.user.providerData[0].phoneNumber,
            photoURL: result.user.providerData[0].photoURL,
            providerId: result.user.providerData[0].providerId,
            uid: result.user.providerData[0].uid
          }
          localStorage.setItem('userInfo', JSON.stringify(dataObj));
          dispatch('editUserInfo',dataObj).then(()=>{
            dispatch('storeGetEntries');
          }); */
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
    firebase.auth().createUserWithEmailAndPassword(userData.login, userData.password)
    .then(result => {
      // eslint-disable-next-line
      console.log(result)
      commit("logUser")
      commit('userId', result.user.uid)
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