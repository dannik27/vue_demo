<template>
  <div id="app">
    <fuzzy></fuzzy>
  </div>

</template>

<script>


import Dasha from "./components/dasha/dasha"
import Fuzzy from "./components/fuzzy-search/fuzzy"
import LikeSearch from "./components/fuzzy-search/like"

export default {
  name: 'app',
  components: {
      Dasha,
      Fuzzy,
      LikeSearch
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
