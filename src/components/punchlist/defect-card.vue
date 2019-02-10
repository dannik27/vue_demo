<template>
  <div class="root">
    <div id="header" class="custom-panel">
      <div>

      </div>
      <div class="buttons-bar">
        <button class="custom-button">
          Approve
        </button>
        <button class="custom-button">
          Take to work
        </button>
        <button class="custom-button">
          sdasd
        </button>
      </div>
    </div>
    <div id="parameters" class="custom-panel">qq</div>
    <div id="schemas" class="custom-panel">ww</div>
    <div id="history" class="custom-panel">cc</div>
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



  .root {
    height: 100%;

    display: grid;
    grid-template-columns: 400px auto;
    grid-template-rows: 80px auto 120px;
    grid-template-areas:
            "header header"
            "parameters history"
            "schemas history";
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    padding: 10px;
  }

  #header {
    grid-area: header;

    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
  }

  .buttons-bar {
    place-self: center end;
  }

  .buttons-bar > *:not(:last-child) {
    margin-right: 10px;
  }

  #parameters {
    grid-area: parameters;
  }
  #schemas {
    grid-area: schemas;
  }
  #history {
    grid-area: history;
  }






</style>
