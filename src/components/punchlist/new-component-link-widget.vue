<template>
  <div class="parent custom-panel">
    <input placeholder="name" v-model="newComponent.name" type="text" />
    <input placeholder="tag" v-model="newComponent.tag" type="text" />
    <select v-model="newComponent.subsystemId">
      <option value="0" disabled>
        Select subsystem
      </option>
      <option
        v-for="subsystem in subsystems"
        v-bind:key="subsystem.id"
        v-bind:value="subsystem.id"
      >
        {{ subsystem.name }}
      </option>
    </select>
    <hr />
    <button
      class="custom-button"
      v-on:click="$emit('new-defect-with-component', { ...newComponent })"
    >
      New defect
    </button>
  </div>
</template>

<script>

export default {
  props: ['subsystems'],
  data() {
    return {
      newComponent: {
        name: '',
        tag: '',
        subsystemId: 0
      },
    }
  },
  methods: {

  },
  mounted() {

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

.parent input {
  margin-bottom: 8px;
}
</style>
