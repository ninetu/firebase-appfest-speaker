import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null, // Will be bound as an object
    orientation: 0
  },
  actions: {
  },
  mutations: {
    UPDATE_USER (state, user) {
      state.user = user
    },
    UPDATE_ORIENTATION (state, orientation) {
      state.orientation = orientation
    },
    ...firebaseMutations
  },
  getters: {
  }
})

window.addEventListener('orientationchange', function () {
  // Announce the new orientation number
  store.commit('UPDATE_ORIENTATION', window.orientation)
  // alert(window.orientation)
}, false)

window.onresize = function (event) {
  if (window.innerHeight > window.innerWidth) {
    store.commit('UPDATE_ORIENTATION', 0)
  } else {
    store.commit('UPDATE_ORIENTATION', 90)
  }
}

export default store
