import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// eslint-disable-next-line
console.log(process.env.KEY)
Vue.config.productionTip = false

store.dispatch('doAuthCheck').then(()=>{
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
});
