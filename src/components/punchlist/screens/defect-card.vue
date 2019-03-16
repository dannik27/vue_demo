<template>
  <div class="root">
    <Dialog v-if="isDialogVisible" @close="abortCommentDialog" :buttons="dialogButtons">
      <h3 slot="header">New comment</h3>
      <div slot="body">
        <textarea autofocus v-model="commentMessage"></textarea>
      </div>
    </Dialog>

    <Dialog v-if="selectedAction" @close="abortActionDialog" :buttons="actionDialogButtons">
      <h3 slot="header">{{ selectedAction.name }}</h3>
      <div slot="body">
        <span>Are you sure to commit "{{ selectedAction.name }}" action</span>
      </div>
    </Dialog>

    <LightBox ref="lightBox" v-bind="lightBoxOptions" :images="attachments"></LightBox>

    <div class="action-bar">
      <button
        v-for="action in defect.availableActions"
        v-bind:key="action.id"
        @click="selectedAction = action"
        class="custom-button"
      >{{ action.name }}</button>
      <button @click="isDialogVisible = true" class="custom-button secondary-button">Comment</button>
      <button @click="lookAtSchema" class="custom-button secondary-button">Look at schema</button>
    </div>

    <div class="card-content">
      <div class="summary custom-panel">
        <h4>{{ defect.externalNumber }} {{ defect.summary }}</h4>
        <p class="label">Component:</p>
        <p>{{ defect.component.name }}</p>
        <p class="label">Status:</p>
        <p>{{ defect.status.name }}</p>
        <p class="label">Facility:</p>
        <p>{{ defect.facility.name }}</p>
        <p class="label">Created date:</p>
        <p>{{ defect.datetime | timestampToString }}</p>
        <p class="label">Discipline:</p>
        <p>{{ defect.discipline.name }}</p>
        <p class="label">Estimated date:</p>
        <p>{{ defect.estimatedDate | timestampToString }}</p>
        <p class="label">Category:</p>
        <p>{{ defect.category.name }}</p>
        <p class="label">Expected worktime:</p>
        <p>{{ defect.expectedWorktime }} hours</p>
      </div>

      <div class="people custom-panel">
        <h6>People</h6>
        <p class="label">Initiators:</p>
        <p>
          <span v-for="person in defect.initiators" :key="person.id">{{ person | shortName }}</span>
        </p>
        <p class="label">Linear:</p>
        <p>{{ defect.linear | shortName }}</p>
        <p class="label">Contractor:</p>
        <p>{{ defect.contractor.name }}</p>
      </div>

      <div class="description custom-panel">
        <h6>Description</h6>
        <div>asd asd as d asdasd sd asda as das das das das dsad asdsdsa dsfdng dgkjfdg fhg fhk hfkj ghfjhfkj hgkfjhgkjfgk jfhg kjfghk</div>
      </div>

      <div class="attachments custom-panel">
        <h6>Attachments</h6>
        <div>
          <div v-for="(attachment, i) in attachments">
            <img :src="attachment.src" @click="showImage(i)">
          </div>
        </div>
      </div>

      <div class="history custom-panel">
        <h6>History</h6>
        <div v-for="item in historyItems" :key="item.id + item.type">
          <hr>
          <div class="history-item">
            <img :src="item.src">
            <div>
              <p class="history-item-header">
                <span>{{ item.datetime | timestampToString }}</span>
                <span>{{ item.person | shortName }}</span>
              </p>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

import api from '../../../services/backend/punchlist-api'
import { timestampToString } from './../../../utils/formatters'

import Dialog from '../../elements/dialog'

import LightBox from 'vue-image-lightbox'

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

function markAsAction(object) {
  object.type = 'action'
  if (object.defectActionType.positive) {
    object.src = '/img/action_ok.png'
  } else {
    object.src = '/img/action_no.png'
  }
  object.text = `Status was changed to "${object.defectActionType.to.name}"`

  return object
}

function markAsComment(object) {
  object.type = 'comment'
  object.src = '/img/comment.png'
  return object
}

function markAsAttachment(attachment) {
  attachment.type = 'png'
  if (attachment.type == 'png') {
    attachment.src = 'data:image/png;base64,' + attachment.source
    attachment.thumb = attachment.src
  }
  attachment.caption = attachment.text
  return attachment
}

export default {
  mixins: [screenMixin],
  components: {
    Dialog,
    LightBox
  },
  props: ['defectId'],
  data() {
    return {
      defect: null,
      selectedAction: null,
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
      actionDialogButtons: [
        {
          text: 'ok',
          handler: this.commitActionDialog
        },
        {
          text: 'cancel',
          handler: this.abortActionDialog
        }
      ],
      commentMessage: '',
      lightBoxOptions: {
        showCaption: true,
        showThumbs: false,
        showLightBox: false
      }
    }
  },
  methods: {
    init: function() {
      api.getDefectCardFormData(this.defectId).then(res => (this.defect = res))
    },

    commitCommentDialog() {
      api.createDefectComment(this.defectId, this.commentMessage).then(res => {
        this.init()
      })

      this.isDialogVisible = false
    },

    abortCommentDialog() {
      this.isDialogVisible = false
    },

    commitActionDialog() {
      api
        .executeDefectAction(this.defectId, this.selectedAction.id)
        .then(res => {
          this.init()
        })
      this.selectedAction = null
    },

    abortActionDialog() {
      this.selectedAction = null
    },

    lookAtSchema() {
      console.log('to schema')
    },

    showImage(index) {
      this.$refs.lightBox.showImage(index)
    }
  },
  computed: {
    attachments() {
      if (this.defect) {
        return this.defect.attachments.map(markAsAttachment)
      } else {
        return []
      }
    },

    historyItems() {
      let result = []
      return result
        .concat(
          this.defect.defectActions.map(markAsAction),
          this.defect.defectComments.map(markAsComment),
          this.attachments
        )
        .sort((a, b) => {
          return a.datetime - b.datetime
        })
    }
  },
  filters: {
    shortName,
    timestampToString
  },
  mounted() {
    this.$store.commit('setTitle', 'Defect')

    this.init()
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

.action-bar .secondary-button {
  background-color: var(--color-secondary-light);
}

.action-bar > .secondary-button {
  margin-left: 20px;
}

.card-content {
  overflow-y: auto;
}

.card-content > div {
  margin: 0 auto;
  width: 700px;
  margin-top: 10px;
}

.summary {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.summary h4 {
  grid-column: 1 / 5;
}

.summary p {
  margin: 0;
}

.people {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.people h6 {
  grid-column: 1 / 3;
}

.people p {
  margin: 0;
}

.attachments > div {
  display: flex;
}

.attachments > div > div {
  width: 110px;
  height: 70px;
  margin-right: 10px;
}

.attachments > div > div > img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.history {
}

.history img {
  width: 100px;
  min-width: 100px;
  height: 70px;
  margin-right: 10px;
}

.history .history-item {
  display: flex;
  margin-bottom: 10px;
}

.history .history-item p {
  margin: 0;
}

.history hr {
  margin: 0 10px 10px 10px;
}

.history-item-header :first-child {
  margin-right: 10px;
}

.label {
  color: rgba(0, 0, 0, 0.589);
}
</style>
