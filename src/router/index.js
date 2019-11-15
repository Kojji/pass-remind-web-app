import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

import HomePage from '../views/Home.vue'
import LoginPage from '../views/Login.vue'
import UserPage from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
   /* eslint-disable no-console */
    beforeEnter(to,from,next) {
      if(!store.getters.logged) { next('login') }
      else next()
    },
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/user',
    name: 'user',
    component: UserPage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
