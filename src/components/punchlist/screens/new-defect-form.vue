<template>
    <div class="root">

        <div class="action-bar">
            <button @click="save" class="custom-button" style="margin-right: 10px;">Save</button>
            <button class="custom-button">Cancel</button>
        </div>
        <div class="flex-container">
            <div id="component" class="custom-panel item">
                <h4>Component</h4>
                <span class="label">Tag</span>
                <span>{{formData.component.tag}}</span>
                <span class="label">Location</span>
                <span>{{formData.component.name}}</span>
                <span class="label">Facility</span>
                <span>{{formData.facility.name}}</span>
            </div>

            <!--<div id="schema" class="custom-panel">-->
            <!--<img src="img/apple.png">-->
            <!--</div>-->

            <div id="participants" class="custom-panel item">
                <h4>Participants</h4>
                <span class="label">Initiators</span>
                <span>{{user | shortName}}</span>
                <span class="label">Linear</span>
                <span>{{formData.linear | shortName}}</span>
                <span class="label">Contractor</span>
                <span>{{formData.contractor.name}}</span>
            </div>

            <div id="params" class="custom-panel item">
                <h4>Parameters</h4>
                <p class="label">Category</p>
                <select v-model="selectedCategory">
                    <option
                            v-for="category in formData.categories"
                            v-bind:key="category.id"
                            v-bind:value="category.id">
                        {{category.name}}
                    </option>
                </select>
                <p class="label">Discipline</p>
                <select v-model="selectedDiscipline">
                    <option
                            v-for="discipline in formData.disciplines"
                            v-bind:key="discipline.id"
                            v-bind:value="discipline.id">
                        {{discipline.name}}
                    </option>
                </select>
                <p class="label">Expected worktime</p>
                <input v-model.number="expectedWorktime" type="number">
                <span style="margin-left: 10px">(amount in hours)</span>
                <p class="label">Date of registration</p>
                <Datepicker></Datepicker>
            </div>

            <!--<div id="photo" class="custom-panel">-->
            <!--<img src="img/apple.png">-->
            <!--</div>-->

            <div id="description" class="custom-panel item">
                <h4>Description</h4>
                <p class="label">Date of registration</p>
                <textarea v-model="summary" placeholder="enter text"></textarea>
            </div>
        </div>


    </div>

</template>

<script>

  import screenMixin from '../../../mixins/screen-mixin'

  import Datepicker from 'vuejs-datepicker';
  import api from '../../../services/backend/punchlist-api'
  import {mapState} from 'vuex'

  import 'vue-loading-overlay/dist/vue-loading.css';

  function shortName(person) {
    return person.secondname + ' ' + person.firstname.split('')[0] + '. ' + person.thirdname.split('')[0] + '. ';
  }

  export default {
    mixins: [screenMixin],
    components: {Datepicker},
    props: ['componentId'],
    data() {
      return {
        selectedDiscipline: -1,
        selectedCategory: -1,
        formData: {},
        expectedWorktime: 0,
        summary: ''
      }
    },
    methods: {
      save: function () {
        api.postNewDefectForm({
          initiators: [this.user.id],
          datetime: '11.11.1111 11:11',
          summary: this.summary,
          description: this.summary,
          componentId: parseInt(this.componentId),
          disciplineId: this.selectedDiscipline,
          categoryId: this.selectedCategory,
          expectedWorktime: this.expectedWorktime
        }).then(res => console.log(res))
      }
    },
    computed: {
      ...mapState({
        user: state => state.session.user
      })
    },
    filters: {
      shortName
    },
    mounted() {
      this.$store.commit('setTitle', 'New defect' + this.componentId)

      let loader = this.$loading.show({});

      api.getNewDefectFormData(this.componentId)
          .then(resp => {
            this.formData = resp;
            loader.hide();
          });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


    .action-bar {
        padding: 10px;
        background-color: var(--color-primary-light);
    }

    .flex-container {
        /*height: 100%;*/

        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        align-content: flex-start;

        padding: 10px;
    }

    .item {
        flex-basis: 45vw;
        min-width: 450px;
        margin-top: 10px;
    }

    #component {
        grid-area: comp;

        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto auto auto;
        grid-template-areas: "title title" "a aa" "b bb" "c cc";
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
        grid-template-areas: "title title" "a aa" "b bb" "c cc";
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

    #schema img {
        display: block;
        margin: auto;

        height: auto;
        min-height: 15vh;
        max-height: 100%;

        width: auto;
        max-width: 100%;
    }

    /*#params input {*/
    /*width: 100%;*/
    /*}*/

    .label {
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

    textarea {
        width: 100%;
        height: 100px;
    }


</style>
