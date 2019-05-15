<template>
  <div class="root">
    <div class="header">
      <button
        @click="loadWorkshops()"
        v-if="selectedWorkshop"
        class="custom-button"
      >
        {{ selectedWorkshop.name }} (click to change)
      </button>
      <button
        @click="loadFacilities(selectedWorkshop.id)"
        v-if="selectedFacility"
        class="custom-button"
      >
        {{ selectedFacility.name }} (click to change)
      </button>
    </div>
    <div class="list">
      <SchemaListItem
        v-bind:named="item"
        v-bind:key="items.id"
        v-for="item in items"
        class="item"
        @click.native="clickOnCard(item)"
      />
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'
import SchemaListItem from '../schema-list-item'

import api from '../../../services/punchlist-api'

export default {
  mixins: [screenMixin],
  components: {
    SchemaListItem
  },
  data() {
    return {
      items: [],
      schemas: [],
      selectedWorkshop: null,
      selectedFacility: null
    }
  },
  methods: {
    clickOnCard: function (item) {
      if (!this.selectedWorkshop) {
        this.selectedWorkshop = item
        this.loadFacilities(item.id)
      } else if (!this.selectedFacility) {
        this.selectedFacility = item
        this.loadSchemas(item.id)
      } else {
        this.$router.push({
          name: 'schema',
          params: {
            schemaId: item.id
          }
        })
      }
    },

    loadWorkshops: function () {
      api
        .selectQuery('workshop').addSort('id', 1).findAll()
        .then(response => {
          this.items = response
          this.selectedWorkshop = null
          this.selectedFacility = null
          this.setTitle('Select workshop')
        })
    },

    loadSchemas: function (facilityId) {
      api
        .selectQuery('schema')
        .addSort('id', 1)
        .addCondition('facilityId', 'equals', facilityId)
        .findAll()
        .then(response => {
          this.items = response
          this.setTitle('Select schema')
        })
    },

    loadFacilities: function (workshopId) {
      api
        .selectQuery('facility')
        .addSort('id', 1)
        .addCondition('workshopId', 'equals', workshopId)
        .findAll()
        .then(response => {
          this.items = response
          this.selectedFacility = null
          this.setTitle('Select facility')
        })
    }
  },
  mounted() {
    this.$store.commit('setTitle', 'Schema list')

    this.loadWorkshops()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  height: 100%;
}

.header {
  background-color: var(--color-primary-light);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 10px;
}

.header :nth-child(1) {
  margin-right: 10px;
}

.list {
  height: calc(100% - 80px);

  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;

  overflow-y: auto;
  overflow-x: hidden;

  padding-bottom: 10px;
}

.item {
  margin: 10px;
  flex-basis: 500px;
  max-width: 500px;
  height: auto;
}
</style>
