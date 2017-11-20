<template>
  <div>
    <mu-sub-header>Manual Upload Photo</mu-sub-header>
    <mu-content-block>
      <input type="file" ref="file1" :disabled="loading" @change="filesChange($event)" @nochange="filesChange($event.target.name, $event.target.files);" accept="image/*" />
    </mu-content-block>
    <mu-content-block>
      <mu-raised-button :disabled="loading" fullWidth primary @click="handleSubmit" label="Upload" />
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      uploadFile: '',
      loading: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    filesChange (e) {
      this.uploadFile = e.target.files[0]
      console.log(this.uploadFile)
    },
    handleSubmit () {
      // upload file
      var self = this
      if (this.uploadFile) {
        self.loading = true
        var file = this.uploadFile
        var storageRef = this.$firebase.storage().ref('camera/' + file.name)
        var metadata = {
          customMetadata: {
            // width: imgWidth,
            // height: imgHeight,
            uid: self.user ? self.user.uid : ''
          }
        }
        storageRef.put(file, metadata).then(function (snapshot) {
          console.log('Uploaded a blob or file!')
          console.log(snapshot.downloadURL)
          console.log(metadata)
          self.loading = false
          self.$router.push('/dashboard')
        })
      } else {
        alert('Please select file to upload')
      }
    }
  },
  mounted () {
  },
  created () {
  }
}

</script>
<style scoped>

</style>
