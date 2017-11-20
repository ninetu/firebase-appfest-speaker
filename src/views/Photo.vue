<template>
  <div>
    <mu-content-block>
      <mu-row gutter>
        <mu-col width="100" tablet="100" desktop="50">
          <div style="overflow: auto; overflow-y: hidden;">
            <div v-for="img in photos" v-bind:key="img.photoURL">
              <svg :width="fixWidth" :height="fixHeight" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <image v-bind:xlink:href="img.photoURL" x="0" y="0" :width="fixWidth" :height="fixHeight" />
                <template v-for="(item,idx) in img.faces">
                  <rect v-bind:y="item['rect']['y']" v-bind:x="item['rect']['x']" v-bind:width="item['rect']['width']" v-bind:height="item['rect']['height']" :stroke="item['rect']['attr']['gender']=='female'?'red':'blue'" fill="white" fill-opacity="0.1" />
                </template>
              </svg>
            </div>
          </div>
        </mu-col>
        <mu-col width="100" tablet="100" desktop="50">
          <mu-row gutter>
            <mu-col width="100" tablet="100" desktop="100">
              <highcharts :options="combineChartOption" ref="combineChart"></highcharts>
            </mu-col>
            <mu-col width="100" tablet="100" desktop="100">
              <highcharts :options="emotionChartOption" ref="emotionChart"></highcharts>
            </mu-col>
          </mu-row>
        </mu-col>
        <mu-col width="100" tablet="100" desktop="100">
        </mu-col>
        <mu-col width="100" tablet="100" desktop="100">
          <highcharts :options="senseChartOption" ref="senseChart"></highcharts>
        </mu-col>
      </mu-row>
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      fixWidth: 682,
      fixHeight: 200,
      photos: [],
      photoId: this.$route.params.id ? this.$route.params.id : '',
      emotionChartOption: {
        chart: {
          marginTop: 0,
          inverted: true,
          marginLeft: 60,
          type: 'bullet',
          height: 95
        },
        title: {
          text: null
        },
        xAxis: {
          categories: ['Happy<br/>Person']
        },
        legend: {
          enabled: false
        },
        yAxis: {
          max: 100,
          plotBands: [{
            from: 0,
            to: 20,
            color: '#e8f5e9'
          }, {
            from: 20,
            to: 50,
            color: '#e8f5e9'
          }, {
            from: 50,
            to: 100,
            color: '#e8f5e9'
          }],
          title: null
        },
        plotOptions: {
          bullet: {
            dataLabels: {
              enabled: true,
              y: 0,
              style: {
                fontWeight: 'bold',
                color: 'black'
              },
              formatter: function () {
                // return this.point.name + ' (' + this.y + ')'
                return this.y + ' happies'
              }
            },
            enableMouseTracking: false
          },
          series: {
            pointPadding: 0,
            borderWidth: 1,
            color: '#4caf50',
            targetOptions: {
              width: '100%'
            }
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          data: [{
            y: 0,
            target: 0
          }]
        }],
        tooltip: {
          pointFormat: '<b>{point.y}</b> (with target at {point.target})'
        }
      },
      combineChartOption: {
        chart: {
          height: 360
        },
        title: {
          text: 'Demographics'
        },
        xAxis: {
          categories: ['N/A', '18-24', '25-34', '35-44', '44+']
        },
        yAxis: {
          title: {
            text: null
          }
        },
        labels: {
          items: [{
            html: 'Gender',
            style: {
              left: '32px',
              top: '0px',
              color: 'black'
            }
          }]
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              y: 0,
              style: {
                fontWeight: 'normal',
                color: '#999'
              }
            },
            enableMouseTracking: false
          },
          spline: {
            dataLabels: {
              enabled: true,
              y: 0,
              style: {
                fontWeight: 'bold',
                color: '#4caf50'
              }
            },
            enableMouseTracking: false
          },
          pie: {
            dataLabels: {
              enabled: true,
              distance: 5,
              formatter: function () {
                // return this.point.name + ' (' + this.y + ')'
                return this.y
              }
            },
            enableMouseTracking: true,
            // startAngle: -90,
            // endAngle: 90,
            center: ['50%', '75%']
          }
        },
        series: [{
          type: 'column',
          name: 'Male',
          data: [0, 0, 0, 0, 0],
          color: '#2196f3'
        }, {
          type: 'column',
          name: 'Female',
          data: [0, 0, 0, 0, 0],
          color: '#e91e63'
        },
        {
          type: 'spline',
          name: 'Total',
          data: [0, 0, 0, 0, 0],
          color: '#4caf50',
          marker: {
            lineWidth: 2,
            lineColor: '#4caf50',
            fillColor: '#4caf50'
            // fillColor: 'blue'
          }
        }, {
          type: 'pie',
          name: 'Gender',
          innerSize: '10%',
          data: [{
            name: 'Male',
            y: 50,
            color: '#2196f3'
          }, {
            name: 'Female',
            y: 50,
            color: '#e91e63'
          }],
          center: [25, 45],
          size: 80,
          showInLegend: false
        }]
      },
      senseChartOption: {
        chart: {
          type: 'areaspline',
          marginRight: 10,
          height: 200,
          events: {
            load: function () {
              // set up the updating of the chart each second
              var series = this.series[0]
              setInterval(function () {
                var x = (new Date()).getTime()
                var y = Math.random()
                series.addPoint([x, y], true, true)
              }, 1000)
            }
          }
        },
        title: {
          text: 'Real Time Happy Index'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: false
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        plotOptions: {
          areaspline: {
            stacking: 'normal',
            lineColor: '#ffffff',
            lineWidth: 1,
            marker: {
              lineWidth: 1,
              lineColor: '#ffffff'
            }
          }
        },
        series: [{
          name: 'Happy',
          data: (function () {
            // generate an array of random data
            var data = []
            var time = (new Date()).getTime()
            var i

            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: Math.random()
              })
            }
            return data
          }())
        }]
      }
    }
  },
  computed: {
    ...mapState(['user', 'win'])
  },
  watch: {
    win (val) {
      console.log('win')
      console.log(val)
    }
  },
  methods: {
    updateChart1 (faces) {
      var dataGender = {
        male: [0, 0, 0, 0, 0],
        female: [0, 0, 0, 0, 0]
      }
      var numSmile = 0
      for (var i = 0; i < faces.length; i++) {
        var face = faces[i]
        var gender = face.faceAttributes.gender
        var age = face.faceAttributes.age
        var smile = face.faceAttributes.smile
        if (age >= 45) {
          dataGender[gender][4]++
        } else if (age >= 35) {
          dataGender[gender][3]++
        } else if (age >= 25) {
          dataGender[gender][2]++
        } else if (age >= 18) {
          dataGender[gender][1]++
        } else {
          dataGender[gender][0]++
        }

        if (smile > 0.9) {
          numSmile++
        }
      }
      /*
      var demoChart = this.$refs.demoChart
      demoChart.chart.series[0].setData(dataGender.male)
      demoChart.chart.series[1].setData(dataGender.female)
      */
      var emotionChart = this.$refs.emotionChart
      var step1 = Math.floor(faces.length / 4)
      var step2 = Math.floor(faces.length / 2)
      emotionChart.chart.series[0].setData([{ y: numSmile, target: faces.length }])
      emotionChart.chart.yAxis[0].addPlotBand({ from: 0, to: step1, color: '#f48fb1' })
      emotionChart.chart.yAxis[0].addPlotBand({ from: step1, to: step2, color: '#e6ee9c' })
      emotionChart.chart.yAxis[0].addPlotBand({ from: step2, to: 100, color: '#a5d6a7' })
      emotionChart.chart.yAxis[0].update({ max: faces.length })

      var combineChart = this.$refs.combineChart
      combineChart.chart.setTitle({ text: 'Total ' + faces.length + ' people' })
      combineChart.chart.series[0].setData(dataGender.male)
      combineChart.chart.series[1].setData(dataGender.female)
      combineChart.chart.series[2].setData([
        dataGender.male[0] + dataGender.female[0],
        dataGender.male[1] + dataGender.female[1],
        dataGender.male[2] + dataGender.female[2],
        dataGender.male[3] + dataGender.female[3],
        dataGender.male[4] + dataGender.female[4]
      ])
      combineChart.chart.series[3].setData([
        dataGender.male.reduce((a, b) => a + b, 0),
        dataGender.female.reduce((a, b) => a + b, 0)
      ])
    },
    cognitiveapi2rectangle (faces, fixScale) {
      var newFaces = []
      if (faces && faces.length > 0) {
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
    var self = this
    var cameraRef = this.$firebase.database().ref()
    // cameraRef.child('camera').orderByChild('ts').limitToFirst(1).on('value', function (snapshot) {
    cameraRef.child('camera/' + self.photoId).on('value', function (snapshot) {
      self.photos = []
      var snapKey = snapshot.key
      var tmp = []
      console.log('snapKey')
      console.log(snapKey)
      if (snapKey === 'camera') {
        snapshot.forEach(function (item) {
          var tmpVal = item.val()
          tmp.push(tmpVal)
        })
      } else {
        var tmpVal = snapshot.val()
        tmp.push(tmpVal)
      }
      console.log('sum')
      console.log(tmp)
      for (var i = 0; i < tmp.length; i++) {
        var val = tmp[i]
        var url = val.file.mediaLink
        var fixRatio = val.meta.height / val.meta.width
        var fixScale = self.fixWidth / val.meta.width
        // var fixHeight = Math.floor(self.fixWidth / val.meta.width * val.meta.height)
        var fixHeight = Math.floor(self.fixWidth * fixRatio)
        self.fixHeight = fixHeight
        var obj = {
          ts: val.ts,
          photoURL: url,
          faces: self.cognitiveapi2rectangle(val.detect, fixScale)
          // faces: self.visionapi2rectangle(val.faces, fixScale)
          // faces: self.convert2retangle(val.faces, val.meta.width, val.meta.height, self.fixWidth, fixHeight)
        }

        // update chart
        if (val.detect && val.detect.length > 0) {
          self.updateChart1(val.detect)
        }
        self.photos.push(obj)
      }
    })
  }
}

</script>
<style scoped>
.imgPreview {
  width: 100%
}
</style>
