<template>
  <div>
      <label>
          X:
          <input v-model="request.x" type="number" />
      </label><br>
      <label>
          Y:
          <input v-model="request.y" type="number" />
      </label><br>
      <label>
          radius:
          <input v-model="request.r" type="number" />
      </label><br>

      <button v-on:click="find" >Save</button><br>

      <span v-if="response != null">
          {{JSON.stringify(response)}}
      </span>

      <BusinessMap></BusinessMap>

  </div>
</template>

<script>

import axios from 'axios';

import BusinessMap from "./business-map"

export default {
    name: 'BusinessAppDemo',
    components : { BusinessMap },
    data () {
        return {
            request : {
                x : 0,
                y : 0,
                r : 0
            },
            response : null
        }
    },
    methods : {
        find : function () {
            axios
                .get(`http://localhost:3000/places/${this.request.x}/${this.request.y}/${this.request.r}`)
                .then(response => (this.response = response.data));
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
