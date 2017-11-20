<template>
  <div>
    <mu-content-block>
      <mu-raised-button style="height:80px" secondary fullWidth icon="equalizer" label="Go to - Real Time Dashboard" to="/dashboard" />
    </mu-content-block>
    <mu-sub-header>Photo Library</mu-sub-header>
    <mu-content-block v-if="loading">
      <mu-linear-progress size="10" />
    </mu-content-block>
    <mu-content-block v-if="!loading">
      <div class="thumb" v-for="img in photos" v-bind:key="img.key">
        <mu-flat-button label="View" icon="pageview" primary :to="'/photo/' + img.key" />
        <mu-flat-button v-show="user && (user.uid == img.uid)" label="Delete" icon="delete" style="color:red" @click="handleRemove(img.key)" href="javascript:void(0)" />
        <br />
        <router-link :to="'/photo/' + img.key">
          <svg :width="fixWidth" :height="fixWidth / img.meta.width * img.meta.height" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image v-bind:xlink:href="img.photoURL" x="0" y="0" :width="fixWidth" :height="fixWidth / img.meta.width * img.meta.height" />
            <template v-for="(item,idx) in img.faces">
              <rect v-bind:y="item['rect']['y']" v-bind:x="item['rect']['x']" v-bind:width="item['rect']['width']" v-bind:height="item['rect']['height']" :stroke="item['rect']['attr']['gender']=='female'?'red':'blue'" fill="white" fill-opacity="0.1" />
            </template>
          </svg>
        </router-link>
      </div>
      <div style="clear:both"></div>
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      loading: true,
      fixWidth: 300,
      fixHeight: 100,
      photos: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    handleRemove (key) {
      if (confirm('Confirm delete ?')) {
        var removeRef = this.$firebase.database().ref()
        removeRef.child('camera/' + key).remove()
      }
    },
    cognitiveapi2rectangle (faces, fixScale) {
      var newFaces = []
      for (var i = 0; i < faces.length; i++) {
        var face = faces[i]
        var newFace = {
          vertice: {
            x: face.faceRectangle.left,
            y: face.faceRectangle.top,
            width: face.faceRectangle.width,
            height: face.faceRectangle.height
          }
        }
        newFace.rect = {
          x: Math.floor(newFace.vertice.x * fixScale),
          y: Math.floor(newFace.vertice.y * fixScale),
          width: Math.floor(newFace.vertice.width * fixScale),
          height: Math.floor(newFace.vertice.height * fixScale),
          attr: face.faceAttributes
        }
        newFaces.push(newFace)
      }
      return newFaces
    },
    // convert2retangle (faces, curWidth, curHeight, fixWidth, fixHeight) {
    visionapi2rectangle (faces, fixScale) {
      var newFaces = []
      for (var i = 0; i < faces.length; i++) {
        var face = faces[i]
        var newFace = {
          vertice: {
            x: face.fdBoundingPoly.vertices[0].x,
            y: face.fdBoundingPoly.vertices[1].y,
            width: face.fdBoundingPoly.vertices[1].x - face.fdBoundingPoly.vertices[0].x,
            height: face.fdBoundingPoly.vertices[2].y - face.fdBoundingPoly.vertices[1].y
          }
        }
        newFace.rect = {
          x: Math.floor(newFace.vertice.x * fixScale),
          y: Math.floor(newFace.vertice.y * fixScale),
          width: Math.floor(newFace.vertice.width * fixScale),
          height: Math.floor(newFace.vertice.height * fixScale)
        }
        /*
        newFace.rect = {
          x: Math.floor(newFace.vertice.x * fixWidth / curWidth),
          y: Math.floor(newFace.vertice.y * fixHeight / curHeight),
          width: Math.floor(newFace.vertice.width * fixWidth / curWidth),
          height: Math.floor(newFace.vertice.height * fixHeight / curHeight)
        }
        */
        newFaces.push(newFace)
      }
      console.log(newFaces)
      return newFaces
    }
  },
  mounted () {
    // var storageRef = this.$firebase.storage().ref()

    var self = this
    var cameraRef = this.$firebase.database().ref()
    cameraRef.child('camera').orderByChild('ts').on('value', function (snapshot) {
      self.photos = []
      snapshot.forEach(function (item) {
        var val = item.val()
        // storageRef.child(val.file.name).getDownloadURL().then(url => {
        var url = val.file.mediaLink
        var fixRatio = val.meta.height / val.meta.width
        var fixScale = self.fixWidth / val.meta.width
        // var fixHeight = Math.floor(self.fixWidth / val.meta.width * val.meta.height)
        var fixHeight = Math.floor(self.fixWidth * fixRatio)
        self.fixHeight = fixHeight
        var obj = {
          key: item.key,
          meta: val.meta,
          ts: val.ts,
          photoURL: url,
          uid: val.file.metadata.uid ? val.file.metadata.uid : '',
          faces: self.cognitiveapi2rectangle(val.detect, fixScale)
          // faces: self.visionapi2rectangle(val.faces, fixScale)
          // faces: self.convert2retangle(val.faces, val.meta.width, val.meta.height, self.fixWidth, fixHeight)
        }

        // update chart
        // self.updateChart1(val.detect)

        self.photos.push(obj)
        // }).catch(err => {
        // console.log('error')
        // console.log(err)
        // })
        self.loading = false
      })
    })
  }
}

</script>
<style scoped>
div.thumb {
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
