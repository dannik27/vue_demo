<template>
  <div>


    <input type="text" v-model="searchString">

    <table v-if="items.length != 0">
      <tr>
        <th>Product</th>
        <th>Rating</th>
      </tr>
      <tr v-for="item in items" :key="item.name">
        <td>{{item.name}}</td>
        <td>{{item.rating}}</td>
      </tr>
    </table>

    <h3 v-else> No matches</h3>


  </div>

</template>

<script>

import axios from "axios"

export default {
    name: 'LikeSearch',
    components: {

    },
    data () {
        return {
            searchString: "",
            items: []
        }
    },
    methods : {
    },
    watch : {
        searchString: function (val) {
            axios
                .get('http://localhost:3000/products?filter=' + val)
                .then(response => this.items = response.data);
        }
    },
    mounted() {

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
