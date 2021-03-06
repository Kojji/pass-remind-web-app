const state = {
  toolBarIcons: {
    helpIcon: "mdi-help-circle",
    exitIcon: "mdi-exit-to-app",
    addIcon: "mdi-plus"
  },
  redirects: {
    redirectLogin: "/login",
    redirectUserPage: "/user"
  },
  
}

const mutations = {
}

const actions = {
}

const getters = {
  toolBarIcons(state) { return state.toolBarIcons },
  redirects(state) { return state.redirects },
}

export default {
  state,
  mutations,
  actions,
  getters
}