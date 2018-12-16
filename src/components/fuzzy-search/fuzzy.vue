<template>
  <div>

    <button v-on:click="update">usda</button>

    <input type="text" v-model="search_field">

    <table v-if="result.length != 0">
      <tr>
        <th>Product</th>
        <th>Rating</th>
      </tr>
      <tr v-for="item in result" :key="item.name">
        <td>{{item.name}}</td>
        <td>{{item.rating}}</td>
      </tr>
    </table>

    <h3 v-else> No matches</h3>


  </div>

</template>

<script>

import axios from "axios"
import Fuse from 'fuse.js/src';

var options = {
    threshold: 0.3,
    shouldSort: true,
    includeScore: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
        "name"
    ]
};


export default {
    name: 'Fuzzy',
    components: {

    },
    data () {
        return {
            selectedItem: "ttt",
            items : [
                {"name":"banana", "rating": 9.5},
                {"name":"apple", "rating": 4},
                {"name":"mango", "rating": 6.5},
                {"name":"dried banana", "rating": 7.5}
                ],
            search_field: "",
            fuse: null
        }
    },
    methods : {

      update : function () {
          axios
              .get('http://localhost:3000/products/all')
              .then(response => this.fuse = new Fuse(response.data, options));
      }

    },
    computed : {
        result : function () {
            if(this.search_field){
                //console.log(this.fuse.search(this.search_field).map(res => res.item).sort((a, b) => a > b ? 1 : -1))

                return this.fuse.search(this.search_field)
                    .map(res => res.item);
            } else {
                return []
            }
        }
    },
    mounted() {
        this.fuse = new Fuse(this.items, options)
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
