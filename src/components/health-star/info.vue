<template>

  <div class="container">

    <h1 v-if="item.name" >{{item.name}}</h1>

    <img src="goods.jpg" width="150px" height="150px"/>

    <!--Apples are free of fat, sodium and cholesterol. That same medium-size aplle contains 4 grams of dietry fiber.-->

    <h3 v-if="item.description" >{{item.description}}</h3>
    <h3 v-else >no description</h3>

    <star-rating
            :increment="0.5"
            :rating="item.rating"
            active-color="#007bff"
            :inline="true"
            :show-rating="false"
            :read-only="true">

    </star-rating>

    <table class="table">
      <tbody>
      <tr>
        <th scope="row">ENERGY</th>
        <td>{{item.energy}}kj</td>
      </tr>
      <tr>
        <th scope="row">SAT FAT</th>
        <td>{{item.fat}}g</td>
      </tr>
      <tr>
        <th scope="row">SUGARS</th>
        <td>{{item.sugars}}g</td>
      </tr>
      <tr>
        <th scope="row">SODIUM</th>
        <td>{{item.sodium}}mg</td>
      </tr>
      <tr>
        <th scope="row">FIBRE</th>
        <td>{{item.fibre}}g</td>
      </tr>
      </tbody>
    </table>


  </div>


</template>

<script>

import axios from "axios"
import StarRating from 'vue-star-rating'

import config from "../../config"


export default {
    name: 'Info',
    components: {
      StarRating
    },
    data () {
        return {
          rating: 4,
          item: {}
        }
    },
    methods : {
      update : function(id) {
        axios
            .get(config.BACKEND_URL + `health-star/${id}`)
            .then(response => this.item = response.data);
      }
    },
    mounted() {
      this.update(this.$route.params.id)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .container{
    text-align:center;
    margin-top: 20px;
  }

  .container > * {
    margin-bottom: 20px;
  }

</style>
