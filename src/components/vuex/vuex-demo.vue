<template>
    <ul>
        <li v-bind:key="item" v-for="item in stringArray" > {{item}} </li>

        <input type="text" v-model="newItem"/> <button v-on:click="addItem(newItem)">Add item</button>
    </ul>
</template>

<script>

  import { mapState } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    name: "vuex-demo",
    data () {
      return {
        newItem : ""
      }
    },
    methods: {
      ...mapMutations([
        'addItem'
      ]),
    },
    computed: {
      ...mapState([
        'stringArray'
      ])
    }

  }
</script>

<style scoped>

</style>