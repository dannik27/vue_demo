<template>
    <ul>
        <button v-on:click="parse1">parse</button>

        <textarea v-model="prettyResult" rows="10" cols="45" name="text"></textarea>

    </ul>
</template>

<script>

  import axios from "axios";

  export default {
    name: "parser",
    data () {
      return {
        result : { name: 'Grijjy', age: 7}
      }
    },
    methods: {
      parse1() {
        axios.get('http://rilga.narod.ru/Tabliza3.htm')
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    computed: {
      prettyResult() {
        return JSON.stringify(this.result, null, 2);
      }
    }

  }
</script>

<style scoped>

</style>