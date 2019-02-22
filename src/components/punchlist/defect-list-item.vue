<template>
  <div class="root custom-panel">
    <div class="line">
      <span> {{defect.category.tag}} </span>
      <span> {{defect.discipline.tag}} </span>
      <span> s das </span>
    </div>
    <span>
      {{defect.summary}}
    </span>
    <hr>
    <div class="grid">
      <div class="grid-column">
        <div>Registered</div>
        <div>{{defect.datetime.split(' ')[0]}}</div>
      </div>
      <div class="grid-column">
        <div>Tag</div>
        <div>{{defect.component.tag}}</div>
      </div>
      <div class="grid-column">
        <div>Initiators</div>
        <div>{{initiators}}</div>
      </div>
    </div>


  </div>

</template>

<script>

export default {
    props: ['defect'],
    methods : {

    },
    computed: {
      initiators: function() {
        let result = '';
        for(let initiator of this.defect.initiators){
          result = result
              + initiator.secondname
              + ' '
              + initiator.firstname.split('')[0]
              + '. '
              + initiator.thirdname.split('')[0]
              + '. '
        }
        return result;
      }
    },
    mounted() {

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
