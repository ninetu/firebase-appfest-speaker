<template>
  <div class="center">
    <mu-content-block>
    <mu-icon value="account_circle" :size="72" color="blue" />
    <p>Please sign-in</p>
    <div id="firebaseui-auth-container" />
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import { ui } from '../initFirebase'
// import router from '../router'

const uiConfig = {
  callbacks: {
    // Called when the user has been successfully signed in
    signInSuccess (user, credential, redirectUrl) {
      // router.push('/')
      // Do not redirect.
      return false
    }
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  // Opens IDP Providers sign-in flow in a popup
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ['https://www.googleapis.com/auth/plus.login']
    }
  ]
  // Terms of service url.
  // tosUrl: 'https://www.google.com'
}

export default {
  mounted () {
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    user (val) {
      if (val) {
        if (this.$router.currentRoute.query.redirect) {
          this.$router.replace(this.$router.currentRoute.query.redirect)
        } else {
          this.$router.replace('/')
        }
      }
    }
  }
}
</script>
<style>
.center {
  text-align: center
}
</style>
