<template>
  <div class="root" v-if="!meta.loading">
    <div class="header">
      <button class="custom-button" @click="selectedTab = 'report'">
        Table
      </button>
      <button class="custom-button" @click="selectedTab = 'chart'">
        Chart
      </button>
    </div>
    <div class="content custom-panel">
      <div v-if="selectedTab == 'report'">
        <table>
          <thead>
            <tr>
              <th>System name</th>
              <th>total</th>
              <th>active</th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="system in systems">
              <tr :key="system.id" class="system-row">
                <td>{{ system.name }}</td>
                <td @click="showDefects(system.id, null, null)">
                  {{ system.values.total }}
                </td>
                <td @click="showDefects(system.id, null, null, true)">
                  {{ system.values.actual }}
                </td>
                <td @click="showDefects(system.id, null, 'A1')">
                  {{ system.values.a }}
                </td>
                <td @click="showDefects(system.id, null, 'B1')">
                  {{ system.values.b }}
                </td>
                <td @click="showDefects(system.id, null, 'C1')">
                  {{ system.values.c }}
                </td>
              </tr>
              <tr
                v-for="discipline in system.disciplines"
                :key="discipline.id + '-' + system.id"
              >
                <td>{{ discipline.name }}</td>
                <td @click="showDefects(system.id, discipline.id, null)">
                  {{ discipline.total }}
                </td>
                <td @click="showDefects(system.id, discipline.id, null, true)">
                  {{ discipline.actual }}
                </td>
                <td @click="showDefects(system.id, discipline.id, 'A1')">
                  {{ discipline.a }}
                </td>
                <td @click="showDefects(system.id, discipline.id, 'B1')">
                  {{ discipline.b }}
                </td>
                <td @click="showDefects(system.id, discipline.id, 'C1')">
                  {{ discipline.c }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="charts" v-if="selectedTab == 'chart'">
        <LineChart
          :chart-data="lineChart.data"
          :options="lineChart.options"
        ></LineChart>
        <PieChart :chart-data="chart.data" :options="chart.options"></PieChart>
        <button @click="lel"></button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/backend/punchlist-api'
import ScreenMixin from '../../../mixins/screen-mixin'

import PieChart from '../../elements/charts/pie-chart'
import LineChart from '../../elements/charts/line-chart'

import demodata from '../../../../resources/linechart'

export default {
  mixins: [ScreenMixin],
  components: { PieChart, LineChart },
  data() {
    return {
      systems: [],
      categories: [],
      selectedTab: 'report',
      meta: {
        loading: true
      },
      chart: {
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'right',
            labels: {
              fontSize: 20
            }
          },
          title: {
            text: 'something',
            display: true,
            fontSize: 20,
          }
        },
        data: {
          datasets: [
            {
              data: [1, 2, 3],
              backgroundColor: ['red', 'blue', 'yellow']
            }
          ],
          labels: [
            'one', 'two', 'three'
          ]
        }
      },
      lineChart: {
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'right',
            labels: {
              fontSize: 20
            }
          },
          title: {
            text: 'active defects',
            display: true,
            fontSize: 20,
          }
        },
        data: demodata

      }
    }
  },
  methods: {

    lel() {
      let data = Object.assign({}, this.chart.data);

      data.datasets[0].data.push(5)
      data.datasets[0].backgroundColor.push('green')
      data.labels.push('green')

      this.chart.data = data
      // this.data = {
      //   datasets: [
      //     {
      //       data: [1, 2, 3, 4],
      //       backgroundColor: ['red', 'blue', 'yellow', 'green']
      //     }
      //   ],
      //   labels: [
      //     'one', 'two', 'three', 'green'
      //   ]
      // }
    },

    showDefects(systemId, disciplineId, categoryTag, actual = false) {
      this.$router.push({
        name: 'defect-list',
        params: {
          filter: {
            systemId,
            disciplineId,
            categoryId: this.categoryIdByTag(categoryTag),
            actual
          }
        }
      })
    },

    categoryIdByTag(categoryTag) {
      let tag = categoryTag

      if (tag) {
        return this.categories.find(category => category.tag === tag).id
      } else {
        return null
      }
    }
  },
  mounted() {
    Promise.all([api.selectQuery('category').findAll(), api.getFormData('report')]).then(
      ([categories, systems]) => {
        this.categories = categories
        this.systems = systems
        this.readyToRender()
      }
    )
  }
}
</script>

<style scoped>
.root {
}

.header {
  background-color: var(--color-primary-light);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 10px;
}

.header :nth-child(1) {
  margin-right: 10px;
}

.content {
  margin: 20px;
}

table {
  width: 100%;
}

th,
td {
  padding: 5px;
}

.system-row {
  background-color: var(--color-secondary-light);
  font-weight: 600;
}

tr :not(:first-child) {
  width: 8%;
}
tbody tr :not(:first-child) {
  cursor: pointer;
}
tbody tr :not(:first-child):hover {
  border: 1px solid #999999;
}

tbody tr :not(:first-child):hover:after {
  /* content: '\1F517'; */
  content: '⬀';
}

thead {
  border-bottom: 1px solid #777777;
}

.charts :nth-child(1) {
  margin-bottom: 130px;
}
</style>
