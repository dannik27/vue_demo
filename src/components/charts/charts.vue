<template>
  <div>
    <button v-on:click="fillData"></button>
    <bar-demo :chartData="data1" :options="options" :height="100" />
  </div>
</template>

<script>
import axios from 'axios'

import config from './../../../config'

import BarDemo from './bar-demo'

export default {
  name: 'Charts',
  components: { BarDemo },
  data() {
    return {
      data1: this.ds,
      options: {
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      },
      ds: {
        labels: [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ],
        datasets: []
      }
    }
  },
  methods: {
    fillData() {
      // this.addDataset({label: 'sse', backgroundColor: '#f87979', data: [12, 21]})
      //     this.ds = {label: 'sse', backgroundColor: '#f87979', data: [12, 21]};
      // var self = this;

      axios
        .get(config.BACKEND_URL + 'report')
        .then(response => {
          console.log(response.data)
          // this.ds = {label: 'sse', backgroundColor: '#f87979', data: [12, 21]};
          // this.addDataset({label: 'sse', backgroundColor: '#f87979', data: [12, 21]})
          response.data.forEach(row =>
            this.ds.datasets.push({
              label: row.name,
              backgroundColor: this.getRandomColor(),
              data: row.data
            })
          )
          this.data1 = this.ds
        })
        .catch(error => {
          console.log(error)
        })
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }
  },
  mounted() {
    this.fillData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
