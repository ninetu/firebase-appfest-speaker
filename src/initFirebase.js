import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './store'

firebase.initializeApp({
  apiKey: 'AIzaSyBYaQkiLZ7_f1OTOtkuU7OolXoAlixhfpY',
  authDomain: 'appfest-speaker.firebaseapp.com',
  databaseURL: 'https://appfest-speaker.firebaseio.com',
  projectId: 'appfest-speaker',
  storageBucket: 'appfest-speaker.appspot.com',
  messagingSenderId: '968066378333'
})

if (__DEV__) {
  window.firebase = firebase
}

export const ui = new firebaseui.auth.AuthUI(firebase.auth())

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
firebase.auth().onAuthStateChanged(user => {
  store.commit('UPDATE_USER', user)
})

export default firebase
