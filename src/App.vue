<template>
  <div id="app">
    <person-card v-bind:key="person.id" v-for="person in persons" v-bind:pers="person" />

    <div>
      <input v-model="newPerson.name" type="text" />
      <input v-model="newPerson.age" type="text" />
      <button v-on:click="save" >Save</button>
    </div>

    <hr>

    <business-app-demo />

  </div>

</template>

<script>

import axios from 'axios';

import PersonCard from "./components/person-card";
import BusinessAppDemo from "./components/business-app-demo"

export default {
  name: 'app',
  components: {
      PersonCard,
      BusinessAppDemo
  },
  data () {
    return {
        persons : [],
        newPerson : {
            "id" : 0,
            "name" : "",
            "age" : 0
        }
    }
  },
  methods : {

      update : function() {
          axios
              .get('http://localhost:3000/')
              .then(response => (this.persons = response.data));
      },
      save : function () {

          axios.post('http://localhost:3000/', this.newPerson)
              .then((response) => {
                  this.update()
              })
              .catch((error) => {
                  console.log(error);
              });
      }

  },
  mounted() {
      this.update();
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
