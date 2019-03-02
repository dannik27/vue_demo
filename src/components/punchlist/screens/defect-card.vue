<template>
    <div class="root">

        <Dialog
                v-if="isDialogVisible"
                @close="isDialogVisible = false"
                :buttons="dialogButtons">
            <h3 slot="header">New comment</h3>
            <div slot="body">
                <textarea v-model="commentMessage"></textarea>
            </div>
        </Dialog>

        <div class="action-bar">
            <button
                    v-for="action in defect.availableActions"
                    v-bind:key="action.id"
                    @click="doAction(action.id)"
                    class="custom-button">
                {{action.name}}
            </button>
            <button
                    @click="isDialogVisible = true"
                    class="custom-button">
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
                <p>{{defect.expectedWorktime}}</p>
                <p>
                    <span v-for="person in defect.initiators" :key="person.id">
                        {{person | shortName}}
                    </span>
                </p>
                <p>{{defect.linear | shortName}}</p>
                <p>{{defect.contractor.name}}</p>
                <p>{{defect.description}}</p>


            </div>
            <div id="schemas" class="custom-panel">ww</div>
            <div id="history">

                <div
                        v-for="item in historyItems"
                        :key="item.id + item.isAction">

                    <div v-if="item.isAction" class="custom-panel history-card">
                        <h6>
                            <span>
                                {{item.datetime}}
                            </span>

                            <span>
                                {{item.person | shortName}}
                            </span>
                            <span>
                                (Initiator)
                            </span>
                        </h6>
                        <hr>
                        <h5>
                            {{item.defectActionType.name}}
                        </h5>
                    </div>

                    <div v-else class="custom-panel history-card">
                        <h6>
                            <span>
                                {{item.datetime}}
                            </span>
                            <span>
                                {{item.person | shortName}}
                            </span>
                            <span>
                                (Initiator)
                            </span>
                        </h6>
                        <hr>
                        <p>
                            {{item.text}}
                        </p>
                    </div>
                </div>

            </div>
        </div>


    </div>

</template>

<script>

  import screenMixin from '../../../mixins/screen-mixin'

  import api from '../../../services/backend/punchlist-api'
  import { stringToDate } from '../../../utils/formatters'

  import Dialog from '../../elements/dialog'

  function shortName(person) {
    return person.secondname + ' ' + person.firstname.split('')[0] + '. ' + person.thirdname.split('')[0] + '. ';
  }

  function markAsAction(object) {
    object.isAction = true;
    return object;
  }

  function markAsComment(object) {
    object.isAction = false;
    return object;
  }

  export default {
    mixins: [screenMixin],
    components: {
      Dialog
    },
    props: ['defectId'],
    data() {
      return {
        defect: {},
        isDialogVisible: false,
        dialogButtons: [
          {
            text: 'ok',
            handler: this.commitCommentDialog
          },
          {
            text: 'cancel',
            handler: this.abortCommentDialog
          }
        ],
        commentMessage: ''
      }
    },
    methods: {

      init: function () {
        api.getDefectCardFormData(this.defectId)
            .then(res => this.defect = res);
      },

      doAction: function (actionId) {

        api.executeDefectAction(this.defectId, actionId)
            .then(res => {
              this.init();
            })
      },

      commitCommentDialog(){

        api.createDefectComment(this.defectId, this.commentMessage)
            .then(res => {
              this.init();
            });

        this.isDialogVisible = false;
      },

      abortCommentDialog(){
        this.isDialogVisible = false;
      }
    },
    computed: {
      historyItems() {
        let result = [];
        return result.concat(
            this.defect.defectActions.map(markAsAction),
            this.defect.defectComments.map(markAsComment)
        ).sort((a, b) => {
          return stringToDate(a.datetime).getTime() - stringToDate(b.datetime).getTime();
        })
      }
    },
    filters: {
      shortName
    },
    mounted() {
      this.$store.commit('setTitle', 'Defect');

      this.init();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .root {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }

    .action-bar {
        padding: 10px;
        background-color: var(--color-primary-light);
    }

    .action-bar > *:not(:last-child) {
        margin-right: 10px;
    }

    .grid-container {
        height: 100%;
        /*flex-grow: 1;*/

        display: grid;
        grid-template-columns: auto 450px;
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
        height: 100%;
    }

    #history > *:not(:last-child) {
        margin-bottom: 10px;
    }

    /*History Card*/

    .history-card h5 > *:not(:last-child) {
        margin-right: 15px;
    }

    .history-card hr {
        margin: 0;
    }

    .history-card p {
        margin: 0;
    }


</style>
