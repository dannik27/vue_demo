<template>
  <div class="root">

  </div>

</template>

<script>

export default {
    props: ['defectId'],
    methods : {

    },
    mounted() {
      this.$store.commit('setTitle', 'Defect')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>





</style>
