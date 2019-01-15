<template>
  <div>

    <p class="menu" v-show="false">
      <router-link to="/health-star/search" tag="button">search</router-link>
      <router-link to="/health-star/info/1" tag="button">info</router-link>
      <router-link to="/health-star/welcome" tag="button">welcome</router-link>
    </p>

    <router-view></router-view>

  </div>

</template>

<script>

export default {
    name: 'HealthStar',
    components: {

    },
    data () {
        return {

        }
    },
    methods : {


    },
    mounted() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
