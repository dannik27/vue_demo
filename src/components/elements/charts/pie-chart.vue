<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'pie-chart',
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    console.log(this.chartData)
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped></style>
