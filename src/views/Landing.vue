<template>
  <div>
    <mu-card>
      <mu-card-header title="Firebase Appfest 2017" subTitle="Bangkok">
        <mu-avatar src="/img/logo_firebase.png" slot="avatar" />
      </mu-card-header>
      <mu-card-media>
        <img src="/img/hello.jpg" />
      </mu-card-media>
      <mu-card-title title="Speaker Helper" />
      <mu-card-text>
        Speaker Helper allow you (as a public speaker to analyze audiences demographics and display result in real-time dashboard)
      </mu-card-text>
      <mu-card-actions>
        <mu-row gutter>
          <mu-col width="50" tablet="50" desktop="50">
            <mu-raised-button fullWidth secondary fullWidth label="I AM CAMERA MAN" />
          </mu-col>
          <mu-col width="50" tablet="50" desktop="50">
            <mu-raised-button fullWidth secondary fullWidth label="I AM SPEAKER" />
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
