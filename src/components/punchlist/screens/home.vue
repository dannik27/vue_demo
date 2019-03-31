<template>
  <div v-if="!meta.loading">
    <div class="menu"></div>
    <div class="root">
      <div class="left-side">
        <div class="custom-panel session">
          <h4>
            Current Session
          </h4>
          <hr />
          <span class="label">
            User:
          </span>
          <span>
            {{ formData.user | shortPersonName }}
          </span>
          <span class="label">
            Company:
          </span>
          <span>
            {{ formData.user.company.name }}
          </span>
          <span class="label">
            DB Status:
          </span>
          <span :style="dbStatusColor">
            <font-awesome-icon icon="circle" />
            {{ dbStatus }}
          </span>
          <span class="label">
            Last update:
          </span>
          <span>
            {{ lastUpdate | timestampToString }}
          </span>
          <hr />
          <router-link
            to="/punchlist/schema-list"
            tag="button"
            class="custom-button"
            >Show schemas</router-link
          >
          <router-link
            to="/punchlist/defect-list"
            tag="button"
            class="custom-button"
            >defect list</router-link
          >
          <router-link to="/punchlist/report" tag="button" class="custom-button"
            >report</router-link
          >
          <button class="custom-button" @click="logout">logout</button>
        </div>
      </div>
      <div class="right-side">
        <h3>Waits for your action</h3>
        <div class="list">
          <DefectListItem
            v-for="defect in formData.waitsForMe"
            v-bind:key="defect.id"
            v-bind:defect="defect"
            class="item"
            @click.native="clickOnCard(defect.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

import { shortPersonName, timestampToString } from '../../../utils/formatters'

import { mapState } from 'vuex'

import api from '../../../services/backend/punchlist-api'
import DefectListItem from '../defect-list-item'

export default {
  mixins: [screenMixin],
  components: { DefectListItem },
  data() {
    return {
      dbStatus: 'ONLINE',
      lastUpdate: new Date().getTime(),
      formData: null,
      meta: {
        loading: true
      }
    }
  },
  methods: {
    clickOnCard: function(defectId) {
      this.$router.push('/punchlist/defect-card/' + defectId)
    }
  },
  filters: { shortPersonName, timestampToString },
  computed: {
    dbStatusColor() {
      switch (this.dbStatus) {
        case 'ONLINE':
        case 'UPDATED':
          return { color: 'var(--color-success)' }
        case 'HAS CHANGES':
          return { color: 'var(--color-warning)' }
        case 'NEED UPDATE':
          return { color: 'var(--color-danger)' }
        default:
          return { color: 'var(--color-inactive)' }
      }
    }
  },
  mounted() {
    this.$store.commit('setTitle', 'PunchList')
    api.getFormData('home').then(result => {
      ;(this.formData = result), this.readyToRender()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu {
  display: flex;
  justify-content: space-evenly;
  padding-top: 10px;
}

.root {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.left-side {
  width: 350px;
}

.left-side,
.right-side {
  padding: 10px;
}

.left-side > *,
.right-side > * {
  margin-bottom: 10px;
}

.right-side {
  flex-grow: 1;
}

.session {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.session h4,
.session hr,
.session .custom-button {
  grid-column: 1/3;
}

.label {
  color: rgba(0, 0, 0, 0.589);
}

hr,
h4,
p {
  margin: 3px 0;
}

.right-side h3 {
  border-bottom: 3px solid rgba(0, 0, 0, 0.589);
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
  display: block;
}
</style>
