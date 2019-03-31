<template>
  <div class="root" v-if="!meta.loading">
    <div class="action-bar">
      <button @click="save" class="custom-button" style="margin-right: 10px;">
        Save
      </button>
      <button class="custom-button">Cancel</button>
    </div>
    <div class="flex-container">
      <div id="component" class="custom-panel item">
        <h4>Component information</h4>
        <span class="label">Tag</span>
        <span>{{ formData.component.tag }}</span>
        <span class="label">Location</span>
        <span>{{ formData.component.name }}</span>
        <span class="label">Facility</span>
        <span>{{ formData.facility.name }}</span>
        <span class="label">Initiators</span>
        <span>{{ formData.user | shortName }}</span>
        <span class="lnabel">Linear</span>
        <span>{{ formData.linear | shortName }}</span>
        <span class="label">Contractor</span>
        <span>{{ formData.contractor.name }}</span>
      </div>

      <div id="params" class="custom-panel item">
        <h4>Parameters</h4>
        <div class="params-summary">
          <p class="label">Summary</p>
          <input v-model="input.summary" />
        </div>

        <div>
          <p class="label">Category</p>
          <select v-model="input.selectedCategory">
            <option
              v-for="category in formData.categories"
              v-bind:key="category.id"
              v-bind:value="category.id"
              >{{ category.name }}</option
            >
          </select>
        </div>

        <div>
          <p class="label">Discipline</p>
          <select v-model="input.selectedDiscipline">
            <option
              v-for="discipline in formData.disciplines"
              v-bind:key="discipline.id"
              v-bind:value="discipline.id"
              >{{ discipline.name }}</option
            >
          </select>
        </div>

        <div>
          <p class="label">Expected worktime (in hours)</p>
          <input v-model.number="input.expectedWorktime" type="number" />
        </div>

        <div>
          <p class="label">Date of registration</p>
          <datetime
            class="datetime-picker"
            v-model="input.datetime"
            v-bind="dateTimePickerOptions"
          ></datetime>
        </div>

        <div class="params-description">
          <p class="label">Description</p>
          <textarea
            v-model="input.description"
            placeholder="enter text"
          ></textarea>
        </div>
      </div>

      <div id="images" class="custom-panel item">
        <h4>Images</h4>
        <transition-group class="tg" name="image-list" tag="div">
          <div
            v-for="image in input.images"
            :key="image.id"
            class="image-list-item"
          >
            <img :src="'data:image/png;base64,' + image.source" />
            <textarea v-model="image.text"></textarea>
            <font-awesome-icon
              class="remove-image-button"
              icon="times"
              @click="removeImage(image)"
            />
          </div>
        </transition-group>
        <button class="custom-button" @click="addImage">Add photo</button>
      </div>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

import { Datetime } from 'vue-datetime'
import api from '../../../services/backend/punchlist-api'
import { mapState } from 'vuex'
import { setTimeout } from 'timers'

function shortName(person) {
  return (
    person.secondname +
    ' ' +
    person.firstname.split('')[0] +
    '. ' +
    person.thirdname.split('')[0] +
    '. '
  )
}

export default {
  mixins: [screenMixin],
  screen: {},
  components: { Datetime },
  props: ['componentId'],
  data() {
    return {
      input: {
        selectedDiscipline: -1,
        selectedCategory: -1,
        expectedWorktime: 0,
        summary: '',
        description: '',
        datetime: new Date().toISOString(),
        images: []
      },
      formData: {},
      dateTimePickerOptions: {
        type: 'datetime',
        auto: true,
        format: 'dd.MM.yyyy HH:mm',
        'input-class': 'datetime-picker-input'
      },
      meta: {
        loading: true,
        persistFields: ['input', 'formData']
      }
    }
  },
  methods: {
    removeImage: function(image) {
      this.images = this.input.images.filter(el => el.id !== image.id)
    },

    addImage: function() {
      this.redirectForResult('camera')
    },

    save: function() {
      api
        .postNewDefectForm({
          initiatorIds: [this.formData.user.id],
          linearId: this.formData.linear.id,
          datetime: Date.parse(this.input.datetime),
          summary: this.input.summary,
          description: this.input.description,
          componentId: parseInt(this.componentId),
          contractorId: this.formData.contractor.id,
          disciplineId: this.input.selectedDiscipline,
          categoryId: this.input.selectedCategory,
          expectedWorktime: this.input.expectedWorktime,
          attachments: this.input.images
        })
        .then(res => this.redirect('defect-list'))
    },

    redirectResult: function(result) {
      this.input.images.push({
        id: (1 + this.input.images.length) * -1,
        datetime: new Date().getTime(),
        personId: this.formData.user.id,
        type: 'png',
        text: '',
        source: result.dataUrl.split(',')[1]
      })
    }
  },
  computed: {
    // ...mapState({
    //   user: state => state.session.user
    // })
  },
  filters: {
    shortName
  },
  mounted() {
    this.$store.commit('setTitle', 'New defect' + this.componentId)

    api.getNewDefectFormData(this.componentId).then(resp => {
      this.formData = resp
      this.readyToRender()
    })
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
  /* height: 100%; */

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: flex-start;

  padding: 10px;
}

.item {
  /* flex-basis: 45vw; */
  min-width: 550px;
  margin-top: 10px;
}

#component {
  grid-area: comp;

  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  grid-template-rows: auto auto auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
}

#component h4 {
  grid-column: 1/5;
}

#schema {
  grid-area: schema;
}

#params {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
}

.params-summary,
.params-description {
  grid-column: 1/3;
}

#params input,
#params select,
.datetime-picker-input {
  width: 100%;
}

.params-description textarea {
  width: 100%;
  height: 100px;
}

.datetime-picker >>> .vdatetime-popup__header,
.datetime-picker >>> .vdatetime-calendar__month__day--selected > span > span,
.datetime-picker
  >>> .vdatetime-calendar__month__day--selected:hover
  > span
  > span {
  background: #ff9800;
}

.datetime-picker >>> .vdatetime-year-picker__item--selected,
.datetime-picker >>> .vdatetime-time-picker__item--selected,
.datetime-picker >>> .vdatetime-popup__actions__button {
  color: #ff9800;
}

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

#images .tg {
  display: block;
}

#images div {
  display: flex;
  margin-bottom: 10px;
}

#images .remove-image-button {
  left: 110px;
  font-size: 40px;
  color: red;
  cursor: pointer;
}

#images textarea {
  margin-bottom: 0;
  height: 100px;
  overflow: hidden;
  flex-grow: 1;
  resize: none;
}

#images div img {
  width: 150px;
  min-width: 150px;
  height: 100px;
}

.image-list-item {
  transition: all 0.3s;
}
.image-list-enter,
.image-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
