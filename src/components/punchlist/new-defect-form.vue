<template>
  <div class="root">

    <div id="component" class="custom-panel">
      <h4>Component</h4>
      <span class="label">Tag</span>
      <span>{{tag}}</span>
      <span class="label">Location</span>
      <span>{{location}}</span>
      <span class="label">Facility</span>
      <span>{{facility}}</span>
    </div>

    <div id="schema" class="custom-panel">
      <img src="img/apple.png">
    </div>

    <div id="participants" class="custom-panel">
      <h4>Participants</h4>
      <span class="label">Initiators</span>
      <span>{{initiators}}</span>
      <span class="label">Linear</span>
      <span>{{linear}}</span>
      <span class="label">Contractor</span>
      <span>{{contractor}}</span>
    </div>

    <div id="params" class="custom-panel">
      <p class="label">Category</p>
      <input>
      <p class="label">Discipline</p>
      <input>
      <p class="label">Worktime</p>
      <input>
      <p class="label">Date of registration</p>
      <Datepicker></Datepicker>
    </div>

    <div id="photo" class="custom-panel">
      <img src="img/apple.png">
    </div>

    <div id="description" class="custom-panel">
      <h4>Description</h4>
    </div>

  </div>

</template>

<script>

  import Datepicker from 'vuejs-datepicker';

export default {
    components: { Datepicker },
    props: ['componentId'],
    data () {
      return {
        tag: 'tagg',
        location: 'locationn',
        facility: 'facilityy',
        initiators: 'initiators initiators initiators',
        linear: 'linearr',
        contractor: 'contractorr'
      }
    },
    methods : {

    },
    mounted() {
      this.$store.commit('setTitle', 'New defect' + this.componentId)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



  .root {
    /*height: 100%;*/

    display: grid;
    /*grid-template-columns: auto auto auto 20vw;*/
    /*grid-template-rows: 20vh auto auto auto;*/
    grid-template-areas:
            "comp comp comp schema"
            "part part part part"
            "params params photo photo"
            "desc desc desc desc";
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    padding: 10px;
  }

  #component {
    grid-area: comp;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
            "title title"
            "a aa"
            "b bb"
            "c cc";
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    padding: 10px;
  }

  #component h4 {
    grid-area: title;
  }

  #schema {
    grid-area: schema;
  }
  #participants {
    grid-area: part;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
            "title title"
            "a aa"
            "b bb"
            "c cc";
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    padding: 10px;
  }
  #participants h4 {
    grid-area: title;
  }

  #params {
    grid-area: params;
  }
  #photo {
    grid-area: photo;
  }
  #description {
    grid-area: desc;
  }

  #schema img{
    display: block;
    margin: auto;

    height: auto;
    min-height: 15vh;
    max-height: 100%;

    width: auto;
    max-width: 100%;
  }

  #params input {
    width: 100%;
  }

  .label{
    font-family: var(--font);
    font-size: 12pt;
    color: #555555;
    margin-bottom: 0px;
  }


  #photo img {

    display: block;
    margin: auto;

    height: auto;
    max-height: 100%;

    width: auto;
    max-width: 100%;

  }




</style>
