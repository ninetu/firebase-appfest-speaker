<template>
  <div>
    <div :class="viewMode?'orientationH':'orientationV'">
      <div class="cameraButton">
        <mu-raised-button class="cameraBtn1" fullWidth secondary icon="arrow_back" label="Back" @click="handleCancel" :disabled="captureDisabled" />
      </div>
      <div class="cameraButton">
        <mu-raised-button class="cameraBtn2" fullWidth primary icon="camera" :label="captureLabel[captureStatus]" @click="handleCapture" :disabled="captureDisabled" />
      </div>
      <!--
              <div class="cameraButton">
                <mu-raised-button style="height:60px" fullWidth secondary icon="autorenew" :label="'CAM ' + (videoTrackNo+1).toString()" @click="handleTrack" :disabled="captureDisabled" />
              </div>
              -->
      <div style="clear:both"></div>
    </div>
    <video ref="video" autoplay="true" width="100%"></video>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      viewMode: 0, // 0 = vertical, 1 = horizontal
      videoTracks: [],
      videoTrackNo: 0,
      imageCapture: null,
      captureDisabled: false,
      captureLabel: ['Capture', 'Uploading'],
      captureStatus: 0,
      captureData: null
    }
  },
  computed: {
    ...mapState(['user', 'orientation'])
  },
  watch: {
    orientation (val) {
      if (val === 0) { // verticle
        this.viewMode = 0
      } else {
        this.viewMode = 1
      }
    }
  },
  mounted () {
    /*
    if (window.innerHeight > window.innerWidth) {
      this.viewMode = 0
    } else {
      this.viewMode = 1
    }
    */
  },
  created () {
    var self = this
    // var mediaOptions = { audio: false, video: true }

    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    }

    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.')
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        optional: [
          { minWidth: 320 },
          { minWidth: 640 },
          { minWidth: 1024 },
          { minWidth: 1280 },
          { minWidth: 1920 },
          { minWidth: 2560 }
        ]
      },
      audio: false
    })
      .then(mediaStream => {
        self.$refs.video.srcObject = mediaStream
        // document.querySelector('video').srcObject = mediaStream
        this.videoTracks = mediaStream.getVideoTracks()
        this.imageCapture = new window.ImageCapture(this.videoTracks[this.videoTrackNo])
      })
      .catch(error => console.log(error))

    /*
    navigator.getUserMedia(mediaOptions, this.getUserMediaSuccess, function (e) {
      // console.log(e)
    })
    */
  },
  methods: {
    handleTrack () {
      if (this.videoTrackNo + 1 < this.videoTracks.length) {
        this.videoTrackNo++
      } else {
        this.videoTrackNo = 0
      }
    },
    getUserMediaSuccess (stream) {
      var video = this.$refs.video
      video.src = window.URL.createObjectURL(stream)
    },
    handleCancel () {
      this.videoTracks[this.videoTrackNo].stop()
      this.$router.push('/')
    },
    handleCapture () {
      this.captureDisabled = true
      this.captureStatus = 1
      var canvas = this.getCapture()
      this.captureData = canvas.toDataURL('image/jpeg')
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
      // console.log('Capture: ' + canvas.width + 'x' + canvas.height)
      return canvas
    },
    uploadCloudStorage (imgDataURL, imgWidth, imgHeight) {
      var message = imgDataURL
      var fileName = (Date.now()).toString() + '.jpg'
      var storageRef = this.$firebase.storage().ref('camera/' + fileName)
      var metadata = {
        customMetadata: {
          // width: imgWidth,
          // height: imgHeight,
          uid: this.user ? this.user.uid : ''
        }
      }
      return storageRef.putString(message, 'data_url', metadata)
    }
  }
}

</script>
<style scoped>
.orientationV {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 999;
}

.orientationV>.cameraButton {
  margin: 10px;
}

.orientationV>.cameraButton>.cameraBtn1,
.orientationV>.cameraButton>.cameraBtn2 {
  height: 50px;
}

.orientationH {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 140px;
  z-index: 999;
}

.orientationH>.cameraButton {
  margin: 10px;
  width: 120px;
}

.orientationH>.cameraButton>.cameraBtn1 {
  height: 60px;
}

.orientationH>.cameraButton>.cameraBtn2 {
  height: 180px;
}
</style>
