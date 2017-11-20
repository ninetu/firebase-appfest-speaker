<template>
  <div>
    <mu-appbar id="my-header" v-show="!fullScreen">
      <router-link to="/" class="logo">Speaker+</router-link>

      <mu-icon-button icon="linked_camera" slot="right" to="/camera" />
      <mu-icon-button icon="photo_library" slot="right" to="/gallery" />
      <!-- <mu-icon-button icon="equalizer" slot="right" to="/dashboard" /> -->
      <mu-icon-button icon="cloud_upload" slot="right" to="/upload" />
      <mu-icon-button v-show="!user" icon="account_circle" slot="right" to="/login" />

      <mu-flat-button v-show="user" slot="right" ref="userButton" to="/profile">
        <mu-avatar :src="user && user.photoURL" style="margin:0 10px; width:28px; height:28px" />
      </mu-flat-button>
    </mu-appbar>
    <!--
      <mu-paper>
        <mu-bottom-nav :value="bottomNav" @change="handleChange">
          <mu-bottom-nav-item value="recents" title="Recents" icon="restore" />
          <mu-bottom-nav-item value="favorites" title="Favorites" icon="favorite" />
          <mu-bottom-nav-item value="nearby" title="Nearby" icon="location_on" />
        </mu-bottom-nav>
      </mu-paper>
      -->
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    fullScreen: false,
    userMenuOpen: false,
    userMenuTrigger: null
  }),
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  watch: {
    user (val) {
      if (val) {
        this.userMenuTrigger = this.$refs.userButton.$el
      }
    },
    '$route': function () {
      // this.bottomNav = this.currentPath.substring(1)
      if (this.$route.path === '/camera') {
        this.fullScreen = true
      } else {
        this.fullScreen = false
      }
    }
  },
  mounted () {
    console.log(this.$route.path)
  },
  methods: {
  }
}
</script>
<style lang="sass">
#my-header
  .logo
    color: white
    text-decoration: none
    padding: 10px
</style>
