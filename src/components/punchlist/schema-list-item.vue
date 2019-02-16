<template>
  <div class="root custom-panel">
    <div class="line">
      <span v-bind:key="tag" v-for="tag in named.tags" > {{tag}} </span>
    </div>
    <span>
      {{named.name}}
    </span>

  </div>

</template>

<script>

export default {
    props: {
      named: {
        type: Object,
        default: function() {
          return {
            name: "somename",
            tags: ['tag1', 'tag2']
          }

        }
      }
    },
    methods : {

    },
    mounted() {
      this.$store.commit('setTitle', 'Defect item')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .root:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .root hr {
    margin: 4px;
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
