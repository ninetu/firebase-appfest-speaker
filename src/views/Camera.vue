<template>
  <div>
    <mu-card>
      <video ref="video" autoplay="true" width="100%"></video>
      </mu-card-text>
      <mu-card-actions>
        <mu-raised-button fullWidth secondary :label="captureLabel[captureStatus]" @click="handleCapture" :disabled="captureDisabled" />
      </mu-card-actions>
      <mu-card-text>
        By pressing "capture". Application will take a snapshot and upload to Firebase Cloud Storage
      </mu-card-text>
    </mu-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      captureDisabled: false,
      captureLabel: ['Capture', 'Uploading'],
      captureStatus: 0
    }
  },
  created () {
    var mediaOptions = { audio: false, video: true }

    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    }

    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.')
    }

    navigator.getUserMedia(mediaOptions, this.getUserMediaSuccess, function (e) {
      // console.log(e)
    })
  },
  methods: {
    getUserMediaSuccess (stream) {
      var video = this.$refs.video
      video.src = window.URL.createObjectURL(stream)
    },
    handleCapture () {
      this.captureDisabled = true
      this.captureStatus = 1
      var canvas = this.getCapture()
      this.uploadCloudStorage(canvas.toDataURL('image/jpeg'), canvas.width, canvas.height)
        .then(res => {
          console.log('Success')
          console.log(res)
          this.captureDisabled = false
          this.captureStatus = 0
        })
        .catch(err => {
          console.log('Error')
          console.log(err)
          this.captureDisabled = false
          this.captureStatus = 0
        })
    },
    getCapture () {
      var video = this.$refs.video
      if (!this.ctx) {
        let canvas = document.createElement('canvas')
        canvas.height = video.clientHeight
        canvas.width = video.clientWidth
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
      }
      const { ctx, canvas } = this
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      console.log('Capture: ' + canvas.width + 'x' + canvas.height)
      return canvas
    },
    uploadCloudStorage (imgDataURL, imgWidth, imgHeight) {
      var message = imgDataURL
      var fileName = (Date.now()).toString() + '.jpg'
      var storageRef = this.$firebase.storage().ref('appfest2/' + fileName)
      var metadata = {
        contentType: 'image/jpeg',
        width: imgWidth,
        height: imgHeight
      }
      return storageRef.putString(message, 'data_url', metadata)
    }
  }
}

</script>
<style scoped>

</style>
