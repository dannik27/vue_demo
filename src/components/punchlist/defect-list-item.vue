<template>
  <div class="root">
    <div class="line">
      <span> s das </span>
      <span> s das </span>
      <span> s das </span>
    </div>
    <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </span>
    <div class="grid">
      <div class="grid-column">
        <div>Registered</div>
        <div>22.22.2222</div>
      </div>
      <div class="grid-column">
        <div>Tag</div>
        <div>AAA-000-BBB</div>
      </div>
      <div class="grid-column">
        <div>Initiators</div>
        <div>Petrov I.I. Ivanov B.A. Semyonov E.S.</div>
      </div>
    </div>


  </div>

</template>

<script>

export default {
    props: ['defectInfo'],
    methods : {

    },
    mounted() {
      this.$store.commit('setTitle', 'Defect item')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.root {
  background-color: #546de5;

  padding: 10px;

  border-radius: 2px;

}

  .grid {

    overflow: hidden;
    white-space: nowrap;
  }

  .grid-column {
    /*float:left;*/
    margin-right: 10px;
    display: inline-block;
  }



</style>
