import Vue from 'vue';
import App from './App';
import store from '../store';
import router from './router';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

store.dispatch('doAuthCheck').then(()=>{
  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
  });
});
