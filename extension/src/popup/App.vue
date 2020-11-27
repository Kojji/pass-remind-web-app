<template>
  <div id="layout">
    <div>
      <h3>PassRemind Extension</h3>
    </div>
    <div v-show="getLoading">
      <div class="loading-animation"></div>
    </div>
    <div v-show="!getLoading">
      <router-view></router-view>
      <div v-if="getLoadingModal">
        <div class="loading-animation"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import browser from 'webextension-polyfill';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getLoading",
      "getLoadingModal",
      "getLogged",
    ])
  },
  mounted() {
    this.$store.commit('setLoading', true);
    browser.tabs.query({currentWindow: true, active: true})
      .then((res)=>{
        var hostname;
        let doubleSlashIndex = res[0].url.indexOf("//");
        let protocol;
        //find and keep only the hostname
        if (doubleSlashIndex > -1) {
          //save protocol for reattachment later 
          protocol = res[0].url.slice(0,doubleSlashIndex + 2);
          hostname = res[0].url.split('/')[2];
        }
        else {
          hostname = res[0].url.split('/')[0];
          hostname = hostname.split(':')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        hostname = protocol + hostname;
        this.$store.commit('setPageURL', hostname);
      }).finally(()=>{
        if(this.getLogged) {
          this.$router.push("/main");
        }
        this.$store.commit('setLoading', false);
      })
  }
};
</script>

<style scoped>
@keyframes mymove {
  0%   {left: -30px;}
  100% {left: 100%;}
}

.loading-animation {
  width: 30px;
  height: 6px;
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(255,255,255,1) 10%, rgba(14,193,187,1) 73%, rgba(9,9,121,1) 83%, rgba(2,0,36,1) 89%);
  position: relative;
  border-radius: 2px;
  animation: mymove 2s infinite;
}

#layout {
  width: 200px;
}
</style>
