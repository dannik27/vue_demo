<template>
  <div id="app">
    <dasha></dasha>
  </div>

</template>

<script>


import Dasha from "./components/dasha/dasha"


export default {
  name: 'app',
  components: {
      Dasha
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
