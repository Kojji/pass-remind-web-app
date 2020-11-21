import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

import firebase from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';

firebase.initializeApp(firebaseConfig)

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
