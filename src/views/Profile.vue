<template>
  <div class="center">
    <mu-content-block>
    <img :src="user.photoURL" style="height:72px" />
    <p>{{user.displayName}}</p>
    <mu-raised-button fullWidth secondary label="Sign out" to="/logout" />
    </mu-content-block>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped>
.center {text-align: center}
</style>
