<template>

    <hooper pagination="no">

      <slide>
        <div class="slide">
          <img src="healthstar.png" width="300px" height="300px"/>
          <h4>Find your favorite food by name</h4>
          <router-link to="/health-star/search" tag="button" class="btn btn-primary">
            Continue
          </router-link>
        </div>
      </slide>

      <slide>
        <div class="slide">
          <img src="camera.png" width="300px" height="300px"/>
          <h4>Or simply insert a photo</h4>
          <router-link to="/health-star/search" tag="button" class="btn btn-primary">
            Continue
          </router-link>
        </div>
      </slide>

      <slide>
        <div class="slide">
          <img src="rating.png" width="300px" height="300px"/>
          <h4>And learn the health rating!</h4>
          <router-link to="/health-star/search" tag="button" class="btn btn-primary">
            Continue
          </router-link>
        </div>
      </slide>

      <hooper-navigation slot="hooper-addons"></hooper-navigation>

    </hooper>


</template>

<script>

import axios from "axios"
import { Hooper, Slide, Navigation as HooperNavigation} from 'hooper';

import config from "../../config"

export default {
    name: 'Welcome',
    components: {
      Hooper,
      Slide,
      HooperNavigation
    },
    data () {
        return {
          items : [],
          searchString: ""
        }
    },
    methods : {

    },
    mounted() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .slide{
    text-align: center;
  }

  .slide > * {
    margin-bottom: 30px;
  }

</style>
