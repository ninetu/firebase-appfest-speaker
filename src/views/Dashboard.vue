<template>
  <div>
    <mu-content-block>
      <mu-row gutter>
        <mu-col width="100" tablet="60" desktop="60">
          <img src="/img/hello.jpg" class="imgPreview" />
        </mu-col>
        <mu-col width="100" tablet="40" desktop="40">
          <mu-text-field type="file" :underlineShow="false" />
          <highcharts :options="genderChartOption" ref="genderChart"></highcharts>
          <highcharts :options="emotionChartOption" ref="emotionChart"></highcharts>
        </mu-col>
        <mu-col width="100" tablet="60" desktop="60">
          <highcharts :options="senseChartOption" ref="senseChart"></highcharts>
        </mu-col>
        <mu-col width="100" tablet="40" desktop="40">
          <highcharts :options="demoChartOption" ref="demoChart"></highcharts>
        </mu-col>
      </mu-row>
    </mu-content-block>
  </div>
</template>
<script>
export default {
  data () {
    return {
      genderChartOption: {
        chart: {
          type: 'bar',
          height: 100
        },
        title: {
          text: null
        },
        xAxis: {
          title: {
            text: null
          },
          visible: false
        },
        yAxis: {
          min: 0,
          title: {
            text: null
          },
          visible: false
        },
        labels: {
          enabled: true
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            stacking: 'percent'
          }
        },
        series: [{
          name: 'Male',
          data: [4]
        }, {
          name: 'Female',
          data: [5]
        }]
      },
      emotionChartOption: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: 320
        },
        title: {
          text: 'Emotions',
          align: 'center',
          verticalAlign: 'middle',
          y: 40
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                color: 'white'
              }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
          }
        },
        series: [{
          type: 'pie',
          name: 'Emotion',
          innerSize: '50%',
          data: [
            ['Happy', 10.38],
            ['Netrual', 56.33],
            ['Unhappy', 24.03]
          ]
        }]
      },
      demoChartOption: {
        chart: {
          height: 240,
          type: 'column'
        },
        title: {
          text: 'Demographics'
        },
        xAxis: {
          categories: ['N/A', '18 - 24', '25-34', '35-44', '45-54', '55+']
        },
        yAxis: {
          title: {
            text: null
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Male',
          data: [1, 2, 3, 4, 5, 6],
          color: '#2196f3'
        }, {
          name: 'Female',
          data: [2, 3, 4, 5, 6, 7],
          color: '#f48fb1'
        }]
      },
      senseChartOption: {
        chart: {
          type: 'areaspline',
          marginRight: 10,
          height: 240,
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
          text: 'Live Sentiment Analysis'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: 'Value'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        legend: {
          enabled: true
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
  }
}

</script>
<style scoped>
.imgPreview {
  width: 100%
}
</style>
