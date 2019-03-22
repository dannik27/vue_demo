<template>
  <div class="parent custom-panel">
    <p>{{component.name}}</p>
    <p>{{component.tag}}</p>
    <hr>
    <div v-for="defect in component.defects" :key="defect.id">
      <span @click="showPopup($event, defect.id)" class="custom-link">{{defect.summary}}</span>
      <br>
    </div>

    <!-- <DefectListItem v-bind:defect="component.defects[0]"/> -->
    <hr>
    <button class="custom-button" v-on:click="$emit('new-defect', component.id)">New defect</button>
  </div>
</template>

<script>
import api from '../../services/backend/punchlist-api'

import DefectListItem from './defect-list-item'

export default {
  props: ['componentId'],
  components: {
    DefectListItem
  },
  data() {
    return {
      component: null
    }
  },
  methods: {
    init: function() {
      api
        .getComponentLinkWidgetFormData(this.componentId)
        .then(res => (this.component = res))
    },

    showPopup: function(event, defectId) {
      this.$popup.show({
        left: event.x,
        top: event.y,
        type: 'defect',
        objectId: defectId
      })
    }
  },
  watch: {
    componentId: function(oldVal, newVal) {
      this.init()
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.parent {
  display: flex;
  flex-direction: column;
}

.parent hr {
  margin: 4px;
}
</style>
