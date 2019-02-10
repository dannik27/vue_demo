<template>
  <div>

    <div class="menu">
      <router-link to="/punchlist/schema" tag="button" class="custom-button">schema</router-link>
      <router-link to="/punchlist/camera" tag="button" class="custom-button">camera</router-link>
      <router-link to="/punchlist/defect-list" tag="button" class="custom-button">defects</router-link>

    </div>


  </div>

</template>

<script>

export default {
    components: {

    },
    data () {
        return {

        }
    },
    methods : {


    },
    mounted() {
      this.$store.commit('setTitle', 'PunchList')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .menu{
    display: flex;
    justify-content: space-evenly;
    padding-top: 10px;
  }

  .menu div{
    /*background-color: var(--color-secondary);*/
    /*flex-basis: 200px;*/
    /*color: var(--text-secondary);*/
    /*box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);*/

    /*border-radius: 2px;*/
    /*display: inline-block;*/
    /*padding: 10px;*/

    /*cursor: pointer;*/
  }

  /*.menu div:hover{*/
    /*box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);*/
  /*}*/

</style>
