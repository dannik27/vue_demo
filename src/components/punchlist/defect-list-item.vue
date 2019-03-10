<template>
  <div class="root custom-panel">
    <div class="line">
      <span class="badge badge-pill" v-bind:style="[statusColor]">{{ defect.status.name }}</span>
      <span class="badge badge-pill" v-bind:style="[categoryColor]">{{ defect.category.tag }}</span>
      <span class="badge badge-pill">{{ defect.discipline.tag }}</span>
    </div>
    <span>{{ defect.summary }}</span>
    <hr>
    <div class="grid">
      <div class="grid-column">
        <div>Registered</div>
        <div>{{ defect.datetime | timestampToString }}</div>
      </div>
      <div class="grid-column">
        <div>Tag</div>
        <div>{{ defect.component.tag }}</div>
      </div>
      <div class="grid-column">
        <div>Initiators</div>
        <div>{{ initiators }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToString } from '../../utils/formatters'

export default {
  props: ['defect'],
  methods: {},
  filters: {
    timestampToString
  },
  computed: {
    initiators: function() {
      let result = ''
      for (let initiator of this.defect.initiators) {
        result =
          result +
          initiator.secondname +
          ' ' +
          initiator.firstname.split('')[0] +
          '. ' +
          initiator.thirdname.split('')[0] +
          '. '
      }
      return result
    },

    statusColor() {
      switch (this.defect.status.tag) {
        case 'INITIATED':
        case 'TAKEN_TO_WORK':
          return { backgroundColor: 'var(--color-fine)', color: '#fff' }
        case 'WAIT_FOR_APPROVE':
        case 'APPROVED':
        case 'DONE':
          return { backgroundColor: 'var(--color-warning)', color: '#fff' }
        case 'CONFIRMED':
          return { backgroundColor: 'var(--color-success)', color: '#fff' }
        default:
          return { backgroundColor: 'var(--color-inactive)', color: '#fff' }
      }
    },

    categoryColor() {
      switch (this.defect.category.tag) {
        case 'A1':
        case 'A2':
          return { backgroundColor: 'var(--color-danger)', color: '#fff' }
        case 'B1':
        case 'B2':
          return { backgroundColor: 'var(--color-warning)', color: '#fff' }
        case 'C1':
        case 'C2':
          return { backgroundColor: 'var(--color-inactive)', color: '#fff' }
      }
    }
  },
  mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.root hr {
  margin: 4px;
}

.line * {
  margin-right: 5px;
}

.grid {
  overflow: hidden;
  white-space: nowrap;
}

.grid-column {
  margin-right: 10px;
  display: inline-block;
}
</style>
