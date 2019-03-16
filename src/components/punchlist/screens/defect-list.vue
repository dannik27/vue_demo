<template>
  <div class="root">
    <div class="columns">
      <div class="list">
        <DefectListItem
          v-for="defect in filteredDefects"
          v-bind:key="defect.id"
          v-bind:defect="defect"
          class="item"
          @click.native="clickOnCard(defect.id)"
        />
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar custom-panel">
          <div class="filter-header">
            <h3>Filter</h3>
            <button v-if="!filter.clean" class="custom-button" @click="resetFilter">reset</button>
          </div>
          <label>
            <input type="checkbox" v-model="filter.my">
            My defects only
          </label>
          <label>
            <input type="checkbox" v-model="filter.actual">
            Actual defects
          </label>
          <label>
            <input type="checkbox" v-model="filter.waitsForMe">
            Waits my action
          </label>
          <select v-model="filter.system">
            <option :value="null" disabled>Filter by System</option>
            <option
              v-for="system in systems"
              v-bind:key="system.id"
              v-bind:value="system"
            >{{ system.name }}</option>
          </select>
          <select v-model="filter.category">
            <option :value="null" disabled>Filter by category</option>
            <option
              v-for="category in categories"
              v-bind:key="category.id"
              v-bind:value="category"
            >{{ category.name }}</option>
          </select>
          <select v-model="filter.discipline">
            <option :value="null" disabled>Filter by disciplinene</option>
            <option
              v-for="discipline in disciplines"
              v-bind:key="discipline.id"
              v-bind:value="discipline"
            >{{ discipline.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

import DefectListItem from '../defect-list-item'

import api from '../../../services/backend/punchlist-api'

export default {
  mixins: [screenMixin],
  components: {
    DefectListItem
  },
  data() {
    return {
      defects: [],
      filter: {
        my: false,
        waitForMe: false,
        actual: false,
        system: null,
        discipline: null,
        category: null,
        clean: true
      },
      systems: [],
      categories: [],
      disciplines: []
    }
  },
  watch: {
    filter: {
      handler: function(filter) {
        filter.clean =
          !filter.my &&
          !filter.actual &&
          !filter.waitsForMe &&
          !filter.system &&
          !filter.discipline &&
          !filter.category
      },
      deep: true
    }
  },
  methods: {
    clickOnCard: function(defectId) {
      this.$router.push('/punchlist/defect-card/' + defectId)
    },

    resetFilter() {
      this.filter.my = false
      this.filter.actual = false
      this.filter.waitsForMe = false
      this.filter.system = null
      this.filter.discipline = null
      this.filter.category = null
    }
  },
  computed: {
    filteredDefects: function() {
      return this.defects
        .filter(defect => !this.filter.my || defect.userRole != -1)
        .filter(
          defect =>
            !this.filter.waitsForMe ||
            (defect.status.responsibleRole &&
              defect.userRole == defect.status.responsibleRole)
        )
        .filter(
          defect =>
            !this.filter.actual ||
            !['CLOSED', 'CONFIRMED'].includes(defect.status.tag)
        )
        .filter(
          defect =>
            !this.filter.system || defect.system.id == this.filter.system.id
        )
        .filter(
          defect =>
            !this.filter.category ||
            defect.categoryId == this.filter.category.id
        )
        .filter(
          defect =>
            !this.filter.discipline ||
            defect.disciplineId == this.filter.discipline.id
        )
    }
  },
  mounted() {
    this.$store.commit('setTitle', 'Defect list')

    api.getDefectListFormData().then(res => (this.defects = res))

    api.getAny('system').then(res => (this.systems = res))
    api.getAny('category').then(res => (this.categories = res))
    api.getAny('discipline').then(res => (this.disciplines = res))
  }
}
</script>

<style scoped>
.root {
  height: 100%;
}

.columns {
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: flex-start;
  align-content: flex-start;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /* align-items: center; */
  align-content: flex-start;

  overflow: auto;

  padding-bottom: 10px;

  flex-grow: 1;
}

.item {
  margin-top: 20px;
  flex-basis: 440px;
  max-width: 440px;
  height: auto;
}

.sidebar-wrapper {
  padding: 20px;
}

.sidebar {
  width: 100%;
  min-width: 300px;

  display: flex;
  flex-direction: column;
}

.sidebar * {
  margin-bottom: 10px;
}

.filter-header {
  position: relative;
}

.filter-header button {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
