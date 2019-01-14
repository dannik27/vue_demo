<template>

  <div class="container">

    <h1>Apple</h1>

    <img src="apple.png" width="150px" height="150px"/>

    <h3>Apples are free of fat, sodium and cholesterol. That same medium-size aplle contains 4 grams of dietry fiber.</h3>

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
        <th scope="row">NUTRIENT</th>
        <td>{{item.sodium}}g</td>
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
          item: {
            rating: 0,
            name: "",
            description: "",
            energy: 519.1,
            fat: 21.48,
            sugars: 1.83,
            sodium: 90
          }
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
  }

  .container > * {
    margin-bottom: 20px;
  }

</style>
