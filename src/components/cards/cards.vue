<template>
  <div>
    <person-card v-bind:key="person.id" v-for="person in persons" v-bind:pers="person" />

    <div>
      <input v-model="newPerson.name" type="text" />
      <input v-model="newPerson.age" type="text" />
      <button v-on:click="postPerson(newPerson)" >Save</button>
    </div>

    <hr>

  </div>

</template>

<script>

import PersonCard from "./person-card"

import { mapState, mapActions } from 'vuex';

export default {
    name: 'Dasha',
    components: {
        PersonCard
    },
    data () {
        return {
            newPerson : {
                "id" : 0,
                "name" : "",
                "age" : 0
            }
        }
    },
    computed: {
      ...mapState([
        'persons'
      ])
    },
    methods : {
      ...mapActions([
        'fetchPersons','postPerson'
      ])

    },
    mounted() {
      this.fetchPersons();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
