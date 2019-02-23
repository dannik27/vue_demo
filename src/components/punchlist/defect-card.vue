<template>
    <div class="root">

        <div class="action-bar">
            <button
                    v-for="action in defect.availableActions"
                    v-bind:key="action.id"
                    @click="doAction(action.id)"
                    class="custom-button">
                {{action.name}}
            </button>
            <button class="custom-button">
                Comment
            </button>
        </div>

        <div class="grid-container">
            <div id="parameters" class="custom-panel">
                <p>{{defect.component.name}}</p>
                <p>{{defect.status.name}}</p>
                <p>{{defect.datetime}}</p>
                <p>{{defect.facility.name}}</p>
                <p>{{defect.externalNumber}}</p>
                <p>{{defect.discipline.name}}</p>
                <p>{{defect.category.name}}</p>
                <p>{{defect.worktime}}</p>
                <p>{{initiators}}</p>
                <p>{{defect.linear.secondname}}</p>
                <p>{{defect.contractor.name}}</p>
                <p>{{defect.description}}</p>


            </div>
            <div id="schemas" class="custom-panel">ww</div>
            <div id="history" class="custom-panel">cc</div>
        </div>


    </div>

</template>

<script>

  import api from '../../services/backend/punchlist-api'

  export default {
    props: ['defectId'],
    data() {
      return {
        defect: {}
      }
    },
    methods: {

      init: function() {
        api.getDefectCardFormData(this.defectId)
            .then(res => this.defect = res);
      },

      doAction: function(actionId) {

        api.executeDefectAction(this.defectId, actionId)
            .then(res => {
              this.init();
            })
      }
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
      this.$store.commit('setTitle', 'Defect')

      this.init();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .root{
        height: 100%;
    }

    .action-bar {
        padding: 10px;
        background-color: var(--color-primary-light);
    }
    .action-bar > *:not(:last-child) {
        margin-right: 10px;
    }
    .buttons-bar {
        place-self: center end;
    }

    .grid-container {
        height: 100%;

        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto 120px;
        grid-template-areas: "parameters history" "schemas history";
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        padding: 10px;
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
