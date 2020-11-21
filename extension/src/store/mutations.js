export default {
  setLogged(state, userData) {
    state.logged = userData;
  },
  setLoading(state, userData) {
    state.loading = userData;
  },
  setLoadingModal(state, userData) {
    state.loadingModal = userData;
  },
  setUser(state, userData) {
    state.user = userData;
  },
  setUserDocs(state, userData) {
    state.userDocs = userData;
  },
  setPageURL(state, userData) {
    state.pageURL = userData;
  },
  setEditEntry(state, userData) {
    state.editEntry = userData;
  },
  setCrypto(state, userData) { 
    state.crypto = userData; 
  }
};
