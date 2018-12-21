<template>
  <div>
    <person-card v-bind:key="person.id" v-for="person in persons" v-bind:pers="person" />

    <div>
      <input v-model="newPerson.name" type="text" />
      <input v-model="newPerson.age" type="text" />
      <button v-on:click="save" >Save</button>
    </div>

    <hr>

  </div>

</template>

<script>

import axios from "axios"
import PersonCard from "./person-card"

export default {
    name: 'Dasha',
    components: {
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
                .get('http://localhost:3000/api/')
                .then(response => (this.persons = response.data));
        },
        save : function () {

            axios.post('http://localhost:3000/api/', this.newPerson)
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


</style>
