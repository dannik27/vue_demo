<template>
  <div>
    <!--<person-card v-bind:key="person.id" v-for="person in persons" v-bind:pers="person" />-->
    <person-card v-bind:pers="persons[0]" />
    <person-card v-bind:pers="persons[1]" />
    <person-card v-bind:pers="persons[2]" />

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

import axios from "axios"
import BusinessAppDemo from "./business-app-demo"
import PersonCard from "./person-card"

export default {
    name: 'Dasha',
    components: {
        BusinessAppDemo,
        PersonCard
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card {
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  margin: 1rem;
  position: relative;
  width: 300px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

</style>
