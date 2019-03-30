<template>
  <div class="root" v-if="!loading">
    <div class="content custom-panel">
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
  </div>
</template>

<script>
import api from '../../../services/backend/punchlist-api'
import ScreenMixin from '../../../mixins/screen-mixin'

export default {
  mixins: [ScreenMixin],
  data() {
    return {
      loading: true,
      systems: [],
      categories: []
    }
  },
  methods: {
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
    Promise.all([api.getAny('category'), api.getReportFormData()]).then(
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
  padding: 20px;
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
</style>
