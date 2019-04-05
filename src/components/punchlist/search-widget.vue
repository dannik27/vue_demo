<template>
  <div class="window custom-panel">
    <div class="toggler" @click="toggle()">
      <font-awesome-icon class="toggle-icon" :icon="toggleIconName" />
      <div v-if="!visible">
        Search component
      </div>
    </div>
    <div class="content" v-if="visible">
      <input v-model="searchValue" type="text" placeholder="Component tag" />

      <div
        v-for="mark in limitedResult"
        :key="mark.id"
        class="item"
        @click="select(mark)"
      >
        <hr />
        <div>
          <span>Name:</span><span>{{ mark.object.name }}</span>
        </div>
        <div>
          <span>Tag:</span><span>{{ mark.object.tag }}</span>
        </div>
      </div>

      <hr />
      <span class="overlimit" v-if="searchResult.length > limit"
        >And {{ searchResult.length - limit }} more...</span
      >
    </div>
  </div>
</template>

<script>
import api from '../../services/backend/punchlist-api'


export default {
  props: ['schemaId'],
  data() {
    return {
      visible: false,
      searchValue: "",
      limit: 5,
      marks: []
    }
  },
  methods: {
    init: function () {
      api
        .getFormData('searchWidget', { schemaId: this.schemaId })
        .then(res => (this.marks = res))
    },

    toggle() {
      this.visible = !this.visible;
    },

    select(mark) {
      this.$emit('selected', mark.id)
    }
  },
  computed: {
    toggleIconName() {
      if (this.visible) {
        return "angle-double-right"
      } else {
        return "angle-double-left"
      }
    },

    searchResult() {
      return this.marks
        .filter(mark => mark.entityName == 'component')
        .filter(mark => this.searchValue != '' && mark.object.tag.includes(this.searchValue))

    },

    limitedResult() {
      return this.searchResult
        .slice(0, this.limit)
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window {
  display: flex;
  flex-direction: row;
}

.toggler {
  padding-right: 8px;

  display: flex;
  flex-direction: row;
  align-content: center;

  cursor: pointer;
}

.toggler:hover {
  background-color: #efefef;
}

.toggle-icon {
  height: 100%;
  margin-right: 5px;
}

.content {
  flex-grow: 1;
}

.content input {
  width: 300px;
}

.content hr {
  margin: 3px;
}

.content .item:hover {
  background-color: #efefef;
  cursor: pointer;
}

.content .overlimit {
  color: #555555;
  font-size: 10pt;
}
</style>
