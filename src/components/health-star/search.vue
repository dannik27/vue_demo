<template>
  <div class="container">
    <h1>What’s on your mind?</h1>

    <input
      class="input form-control"
      @keydown="onChange"
      type="text"
      v-model="searchString"
    />

    <div class="list-group">
      <router-link
        :to="'/health-star/info/' + item.id"
        tag="a"
        class="list-group-item list-group-item-action"
        v-for="item in items"
        :key="item.id"
        >{{ item.name }} - {{ item.rating }}</router-link
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import config from './../../../config'

export default {
  name: 'Search',
  components: {},
  data() {
    return {
      items: [],
      searchString: ''
    }
  },
  methods: {
    onChange: function(e) {
      this.update()
    },

    update: function() {
      axios
        .get(
          config.BACKEND_URL + `health-star?limit=10&fuse=${this.searchString}`
        )
        .then(response => (this.items = response.data))
    }
  },
  mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  text-align: center;
}

.input {
  font-size: 30px;
  margin: 40px 0px;
}
</style>
