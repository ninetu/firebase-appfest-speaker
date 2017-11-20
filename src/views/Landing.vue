<template>
  <div>
    <mu-card>
      <mu-card-media>
        <img src="/img/hello.jpg" />
      </mu-card-media>
      <mu-card-title title="Speaker+" />
      <mu-card-text>
        Speaker+ allow you (as a speaker) to analyze audiences demographics and display result in real-time
      </mu-card-text>
      <mu-card-actions>
        <mu-row gutter>
          <mu-col width="50" tablet="50" desktop="25">
            <mu-raised-button style="height:80px; background-color:red" primary fullWidth fullWidth icon="linked_camera" label="TAKE PHOTO" to="/camera" />
          </mu-col>
          <mu-col width="50" tablet="50" desktop="25">
            <mu-raised-button style="height:80px" fullWidth primary fullWidth icon="cloud_upload" label="UPLOAD" to="/upload" />
          </mu-col>
          <mu-col width="50" tablet="50" desktop="25">
            <mu-raised-button style="height:80px; background-color:green" fullWidth secondary fullWidth icon="photo_library" label="GALLERY" to="/gallery" />
          </mu-col>
          <mu-col width="50" tablet="50" desktop="25">
            <mu-raised-button style="height:80px" fullWidth secondary fullWidth icon="equalizer" label="DASHBOARD" to="/dashboard" />
          </mu-col>
        </mu-row>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
