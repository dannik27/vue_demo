<template>
  <div class="body">

    <div class="header">

      <font-awesome-icon class="button" @click="back()" icon="arrow-left"/>
      <font-awesome-icon class="button" @click="home()" icon="home"/>
      <span> {{title}} </span>
      <font-awesome-icon class="button" icon="times"/>

    </div>

    <router-view></router-view>

  </div>

</template>

<script>

  import { mapState } from 'vuex'

export default {
    components: {

    },
    data () {
        return {

        }
    },
    methods : {
      back: function () {
        this.$router.go(-1);
      },
      
      home: function () {
        this.$router.push('/punchlist/home')
      }

    },
    computed: {

        ...mapState(['title'])

    },
    mounted() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .body{
    background-color: #c7c7c7;
  }

  .header{
    background-color: #546de5;
    width: 100%;
    padding: 5px 20px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    display:flex;
    align-items: center;
  }

  .header > *{
    margin-right: 20px;
    color: white;
    font-size: 48px;
  }

  .header span{
    flex-grow: 1;
  }

  .button{
    cursor: pointer;
  }

</style>
