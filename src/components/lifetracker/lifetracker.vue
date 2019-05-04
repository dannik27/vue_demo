<template>
  <div class="root">
    <div class="custom-panel">
      <select v-model="noteForm.theme">
        <option :value="null" disabled>Choose theme</option>
        <option
          v-for="theme in themes"
          v-bind:key="theme.id"
          v-bind:value="theme"
          >{{ theme.name }}</option
        >
      </select>
    </div>
    <div class="custom-panel note-form">
      <input v-model="noteForm.tags" />

      <button @click="saveNote">save</button>

      <textarea v-model="noteForm.text" />
    </div>

    <div class="custom-panel">
      <div v-for="note in notes" v-bind:key="note.id" class="note-item">
        <span> {{ note.createdAt | timestampToString }}</span>
        <span> {{ note.tags }}</span>
        <span>{{ note.text }}</span>
      </div>
    </div>

    <div class="custom-panel">
      <div v-for="payment in payments" v-bind:key="payment.id">
        {{ payment.description }}
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase'
import { timestampToString } from '../../utils/formatters'

function splitTags(tagsAsString) {
  tagsAsString = tagsAsString.trim()
  if (tagsAsString === '') {
    return []
  } else {
    return tagsAsString.split()
  }
}

export default {
  components: {},
  data() {
    return {
      noteForm: {
        theme: 1,
        text: '',
        tags: ''
      },

      payments: [],
      themes: [],
      notes: []
    }
  },
  methods: {
    saveNote() {
      db.collection('notes').add({
        text: this.noteForm.text,
        theme: this.noteForm.theme.id,
        tags: splitTags(this.noteForm.tags),
        createdAt: new Date().getTime()
      })
    }
  },
  filters: {
    timestampToString
  },
  computed: {},
  firestore() {
    return {
      payments: db.collection('payments').orderBy('createdAt'),
      themes: db.collection('theme'),
      notes: db.collection('notes').orderBy('createdAt', 'desc')
    }
  },
  mounted() { }
}
</script>

<style scoped>
.root {
  padding: 10px;
  background-color: #cccccc;
  height: 100%;
}

.note-form {
  width: 600px;
}

.note-form textarea {
  width: 100%;
  height: 200px;
  grid-area: d;
}

.note-form {
  display: grid;
  grid-template-columns: auto 1fr auto;
  /* grid-auto-rows: auto; */
  grid-template-areas: 'a b c' 'd d d';
}

.note-item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'a b' 'd d';
}
</style>
