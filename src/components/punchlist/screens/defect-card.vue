<template>
  <div class="root" v-if="!meta.loading">
    <Dialog
      v-if="isDialogVisible"
      @close="abortCommentDialog"
      :buttons="dialogButtons"
    >
      <h3 slot="header">Новое сообщение</h3>
      <div slot="body">
        <textarea
          class="comment-textarea"
          autofocus
          v-model="commentMessage"
        ></textarea>
      </div>
    </Dialog>

    <Dialog
      v-if="selectedAction"
      @close="abortActionDialog"
      :buttons="actionDialogButtons"
    >
      <h3 slot="header">{{ selectedAction.name }}</h3>
      <div slot="body">
        <div
          v-if="defect.status.tag === 'APPROVED'"
          class="take-to-work-options"
        >
          <p class="label">Исполнитель:</p>
          <select v-model="takeToWorkParams.contractorMemberId">
            <option :value="null" disabled>Укажите исполнителя</option>
            <option
              v-for="person in defect.contractor.members"
              v-bind:key="person.id"
              v-bind:value="person.id"
              >{{ person | shortPersonName }}</option
            >
          </select>
          <p class="label">Предполагаемая дата окончания:</p>
          <datetime
            class="datetime-picker"
            v-model="takeToWorkParams.estimatedDueDate"
            v-bind="dateTimePickerOptions"
          ></datetime>
          <span
            >Вы уверены, что хотите выполнить действие "{{
              selectedAction.name
            }}"</span
          >
        </div>
        <div v-else>
          <span
            >Вы уверены, что хотите выполнить действие "{{
              selectedAction.name
            }}"</span
          >
        </div>
      </div>
    </Dialog>

    <LightBox
      ref="lightBox"
      v-bind="lightBoxOptions"
      :images="attachments"
    ></LightBox>

    <div class="action-bar">
      <button
        v-for="action in defect.availableActions"
        v-bind:key="action.id"
        @click="selectedAction = action"
        class="custom-button"
      >
        {{ action.name }}
      </button>
      <button
        @click="showCommentDialog()"
        class="custom-button secondary-button"
      >
        Сообщение
      </button>
      <button @click="lookAtSchema" class="custom-button secondary-button">
        Перейти к схеме
      </button>
    </div>

    <div class="card-content">
      <div class="summary custom-panel">
        <h4>{{ defect.externalNumber }} {{ defect.summary }}</h4>
        <p class="label">Компонент:</p>
        <p>{{ defect.component.name }}</p>
        <p class="label">Статус:</p>
        <p>{{ defect.status.name }}</p>
        <p class="label">Установка:</p>
        <p>{{ defect.facility.name }}</p>
        <p class="label">Дата создания:</p>
        <p>{{ defect.datetime | timestampToString }}</p>
        <p class="label">Дисциплина:</p>
        <p>{{ defect.discipline.name }}</p>
        <p class="label">Дата окончания:</p>
        <p>{{ defect.estimatedDueDate | timestampToString }}</p>
        <p class="label">Категория:</p>
        <p>{{ defect.category.name }}</p>
        <p class="label">Трудоёмкость:</p>
        <p>{{ defect.expectedWorktime }} (часы)</p>
      </div>

      <div class="people custom-panel">
        <h6>Участники</h6>
        <p class="label">Инициаторы:</p>
        <p>
          <span v-for="person in defect.initiators" :key="person.id">{{
            person | shortPersonName
          }}</span>
        </p>
        <p class="label">Линейный:</p>
        <p>{{ defect.linear | shortPersonName }}</p>
        <p class="label">Подрядчик:</p>
        <p>
          {{ defect.executor | shortPersonName }} ({{ defect.contractor.name }}
          компания)
        </p>
      </div>

      <div class="description custom-panel">
        <h6>Описание</h6>
        <div>{{ defect.description }}</div>
      </div>

      <div class="attachments custom-panel">
        <h6>Прикрепления</h6>
        <div>
          <div v-for="(attachment, i) in attachments">
            <img :src="attachment.src" @click="showImage(i)" />
          </div>
        </div>
      </div>

      <div class="history custom-panel">
        <h6>История</h6>
        <div v-for="item in historyItems" :key="item.id + item.type">
          <hr />
          <div class="history-item">
            <div class="image-container">
              <img :src="item.src" />
            </div>
            <div>
              <p class="history-item-header">
                <span>{{ item.datetime | timestampToString }}</span>
                <span>{{ item.person | shortPersonName }}</span>
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

import api from '../../../services/punchlist-api'
import { timestampToString, shortPersonName } from './../../../utils/formatters'

import Dialog from '../../elements/dialog'

import LightBox from 'vue-image-lightbox'

import { Datetime } from 'vue-datetime'

function markAsAction(object) {
  object.type = 'action'
  if (object.defectActionType.positive) {
    object.src = '/img/action_ok.png'
  } else {
    object.src = '/img/action_no.png'
  }
  object.text = `Статус был изменён на "${object.defectActionType.to.name}"`

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
    LightBox,
    Datetime
  },
  props: ['defectId'],
  data() {
    return {
      takeToWorkParams: {
        contractorMemberId: null,
        estimatedDueDate: new Date().toISOString()
      },
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
      },
      dateTimePickerOptions: {
        type: 'date',
        auto: true,
        format: 'dd.MM.yyyy',
        'input-class': 'datetime-picker-input'
      },
      meta: {
        loading: true
      }
    }
  },
  methods: {
    init: function () {
      api.getFormData('defectCard', { defectId: this.defectId }).then(res => {
        this.defect = res
        this.readyToRender()
      })
    },

    showCommentDialog() {
      this.commentMessage = ''
      this.isDialogVisible = true
    },

    commitCommentDialog() {

      let comment = {
        defectId: this.defectId,
        datetime: new Date().getTime(),
        text: this.commentMessage
      }

      api.postFormData('defectComment', comment).then(res => {
        this.init()
      })

      this.isDialogVisible = false
    },

    abortCommentDialog() {
      this.isDialogVisible = false
    },

    commitActionDialog() {

      let action = {
        datetime: new Date().getTime(),
        defectActionTypeId: this.selectedAction.id,
        parameters: {
          defectId: this.defectId,
          estimatedDueDate: Date.parse(this.takeToWorkParams.estimatedDueDate),
          contractorMemberId: this.takeToWorkParams.contractorMemberId
        }
      }

      api
        .postFormData('defectAction', action)
        .then(res => {
          this.init()
        })
      this.selectedAction = null
    },

    abortActionDialog() {
      this.selectedAction = null
    },

    lookAtSchema() {
      this.$router.push({
        name: 'schema',
        params: {
          schemaId: this.defect.schemaId,
          markId: this.defect.markId
        }
      })
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
    shortPersonName,
    timestampToString
  },
  mounted() {
    this.$store.commit('setTitle', 'Дефект')

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

.take-to-work-options {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.take-to-work-options span {
  grid-column: 1/3;
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

.datetime-picker >>> .datetime-picker-input {
  width: 100%;
  height: 100%;
}

.comment-textarea {
  width: 100%;
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

.history .image-container {
  width: 75px;
  min-width: 75px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
}

.history .image-container img {
  height: 100%;
  width: auto;
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
