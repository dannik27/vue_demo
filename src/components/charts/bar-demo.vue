<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'bar-demo',
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    console.log(this.chartData)
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped></style>
