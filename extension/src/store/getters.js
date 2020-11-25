export default {
  getLogged(state) {
    return state.logged;
  },
  getLoading(state) {
    return state.loading;
  },
  getLoadingModal(state) {
    return state.loadingModal;
  },
  getUser(state) {
    return state.user;
  },
  getUserDocs(state) {
    return state.userDocs;
  },
  getPageURL(state) {
    return state.pageURL;
  },
  getEditEntry(state) {
    return state.editEntry;
  },
  getKey(state) {
    return state.key
  }
}
