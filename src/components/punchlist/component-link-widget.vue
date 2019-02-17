<template>
  <div class="parent custom-panel">
    <p> {{component.name}} </p>
    <p> {{component.tag}} </p>
    <hr>
    <button class="custom-button" v-on:click="$emit('new-defect', component.id)">New defect</button>
  </div>

</template>

<script>

export default {
    props: {
      component: {
        type: Object,
        default: function() {
          return {
            id: 0,
            name: "somename",
            tag: "tag"
          }

        }
      }
    },
    methods : {

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




</style>
