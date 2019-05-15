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
            <button
              v-if="!mergedFilter.clean"
              class="custom-button"
              @click="resetFilter"
            >
              reset
            </button>
          </div>
          <label>
            <input type="checkbox" v-model="mergedFilter.my" />
            My defects only
          </label>
          <label>
            <input type="checkbox" v-model="mergedFilter.actual" />
            Actual defects
          </label>
          <label>
            <input type="checkbox" v-model="mergedFilter.waitsForMe" />
            Waits my action
          </label>
          <select v-model="mergedFilter.systemId">
            <option :value="null" disabled>Filter by System</option>
            <option
              v-for="system in systems"
              v-bind:key="system.id"
              v-bind:value="system.id"
              >{{ system.name }}</option
            >
          </select>
          <select v-model="mergedFilter.categoryId">
            <option :value="null" disabled>Filter by category</option>
            <option
              v-for="category in categories"
              v-bind:key="category.id"
              v-bind:value="category.id"
              >{{ category.name }}</option
            >
          </select>
          <select v-model="mergedFilter.disciplineId">
            <option :value="null" disabled>Filter by disciplinene</option>
            <option
              v-for="discipline in disciplines"
              v-bind:key="discipline.id"
              v-bind:value="discipline.id"
              >{{ discipline.name }}</option
            >
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

import DefectListItem from '../defect-list-item'

import api from '../../../services/punchlist-api'

export default {
  mixins: [screenMixin],
  components: {
    DefectListItem
  },
  props: ['filter'],
  data() {
    return {
      defects: [],
      mergedFilter: {
        my: false,
        waitForMe: false,
        actual: false,
        systemId: null,
        disciplineId: null,
        categoryId: null,
        clean: true
      },
      defaultFilter: {
        my: false,
        waitForMe: false,
        actual: false,
        systemId: null,
        disciplineId: null,
        categoryId: null,
        clean: true
      },
      systems: [],
      categories: [],
      disciplines: []
    }
  },
  watch: {
    mergedFilter: {
      handler: function (filter) {
        filter.clean =
          !filter.my &&
          !filter.actual &&
          !filter.waitsForMe &&
          !filter.systemId &&
          !filter.disciplineId &&
          !filter.categoryId
      },
      deep: true
    }
  },
  methods: {
    clickOnCard: function (defectId) {
      this.$router.push('/punchlist/defect-card/' + defectId)
    },

    resetFilter() {
      this.mergedFilter = Object.assign({}, this.defaultFilter)
    }
  },
  computed: {
    filteredDefects: function () {
      return this.defects
        .filter(defect => !this.mergedFilter.my || defect.userRole != -1)
        .filter(
          defect =>
            !this.mergedFilter.waitsForMe ||
            (defect.status.responsibleRole &&
              defect.userRole == defect.status.responsibleRole)
        )
        .filter(
          defect =>
            !this.mergedFilter.actual ||
            !['CLOSED', 'CONFIRMED'].includes(defect.status.tag)
        )
        .filter(
          defect =>
            !this.mergedFilter.systemId ||
            defect.system.id == this.mergedFilter.systemId
        )
        .filter(
          defect =>
            !this.mergedFilter.categoryId ||
            defect.categoryId == this.mergedFilter.categoryId
        )
        .filter(
          defect =>
            !this.mergedFilter.disciplineId ||
            defect.disciplineId == this.mergedFilter.disciplineId
        )
    }
  },
  mounted() {
    this.$store.commit('setTitle', 'Defect list')

    api.getFormData('defectList').then(res => (this.defects = res))

    api.selectQuery('system').findAll().then(res => (this.systems = res))
    api.selectQuery('category').findAll().then(res => (this.categories = res))
    api.selectQuery('discipline').findAll().then(res => (this.disciplines = res))

    Object.assign(this.mergedFilter, this.defaultFilter, this.filter)
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
