<template>
  <div
    v-if="visible"
    class="wrapper custom-panel"
    @mouseenter="onEnter()"
    @mouseleave="onLeave()"
    v-bind:style="boxstyle"
  >
    <h6>{{ params.type }}</h6>
    <hr>
    <p>{{object[structure.title]}}</p>
    <div class="table">
      <template v-for="field in fieldsRenderResult">
        <span class="label">{{field.name}}</span>
        <span>{{ field.value }}</span>
      </template>
    </div>

    <button
      v-for="action in structure.actions"
      :key="action.caption"
      @click="action.handler"
    >{{action.caption}}</button>
  </div>
</template>

<script>
import PopupPlugin from './popup-plugin'
import { setTimeout } from 'timers'

import api from '../services/backend/punchlist-api'

import { timestampToString, shortPersonName } from '../utils/formatters'

function firstPerson(personList) {
  return shortPersonName(personList[0])
}

function deepFind(obj, path) {
  var paths = path.split('.'),
    current = obj,
    i

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined
    } else {
      current = current[paths[i]]
    }
  }
  return current
}

export default {
  name: 'Popup',
  data() {
    return {
      timer: null,
      timeout: true,
      mouseInside: false,
      params: {
        left: '100px',
        top: '100px'
      },
      object: {
        summary: 'some summary sdfsdf dfdsfdsf dfdfdsf',
        status: {
          kek: 'sdads',
          name: 'statusname'
        },
        externalNumber: 123,
        datetime: 1552843827000
      },
      content: {
        defect: {
          title: 'summary',
          fields: [
            {
              name: 'Number',
              path: 'externalNumber'
            },
            {
              name: 'Initiator',
              path: 'initiators',
              formatter: firstPerson
            },
            {
              name: 'Status',
              path: 'status.name'
            },
            {
              name: 'Date registered',
              path: 'datetime',
              formatter: timestampToString
            },
            {
              name: 'Estimated date',
              path: 'estimatedDoneDate',
              formatter: timestampToString
            }
          ],
          actions: [
            {
              caption: 'GO TO',
              handler: this.toDefect
            }
          ]
        }
      }
    }
  },
  methods: {
    getFieldValue(field) {
      let val = null
      if (field.path) {
        val = deepFind(this.object, field.path)
      } else {
        val = deepFind(this.object, field.name)
      }
      if (field.formatter) {
        val = field.formatter(val)
      }
      return val
    },

    show(params) {
      this.params = params

      let vm = this
      this.timer = setTimeout(() => (vm.timeout = true), 2000)

      api.getPopupObject(this.params.type, this.params.objectId).then(res => {
        this.object = res
        this.timeout = false
      })
    },
    hide() {},
    onEnter() {
      this.mouseInside = true
    },
    onLeave() {
      this.mouseInside = false
    },

    toDefect() {
      clearTimeout(this.timer)
      this.timeout = true
      this.onLeave()
      this.$router.push('/punchlist/defect-card/' + this.object.id)
    }
  },
  computed: {
    visible: function() {
      return this.mouseInside || !this.timeout
    },
    boxstyle: function() {
      return {
        left: this.params.left + 'px',
        top: this.params.top + 'px'
      }
    },
    structure: function() {
      return this.content[this.params.type]
    },
    fieldsRenderResult: function() {
      return this.structure.fields
        .map(field => {
          return {
            name: field.name,
            value: this.getFieldValue(field)
          }
        })
        .filter(field => field.value != undefined)
    }
  },
  mounted() {},
  beforeMount() {
    PopupPlugin.EventBus.$on('show', params => {
      this.show(params)
    })
  }
}
</script>

<style scoped>
.back {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wrapper {
  position: absolute;
  z-index: 9998;
  width: 300px;
}

hr,
h6,
p {
  margin: 3px 0;
}

.table {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.label {
  color: rgba(0, 0, 0, 0.589);
}
</style>
