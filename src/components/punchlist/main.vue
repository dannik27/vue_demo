<template>
  <div class="body">

    <div class="header">

      <font-awesome-icon class="button" @click="back()" icon="arrow-left"/>
      <font-awesome-icon class="button" @click="home()" icon="home"/>
      <span> {{title}} </span>
      <font-awesome-icon class="button" icon="times"/>

    </div>

    <div class="content">
      <!--<keep-alive>-->
        <router-view></router-view>
      <!--</keep-alive>-->
    </div>

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
    background-color: #dddddd;

    height: 100%;

  }

  .header{
    background-color: var(--color-primary);
    width: 100%;
    padding: 0 20px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    display:flex;
    align-items: center;
  }

  .header > *{
    margin-right: 20px;
    color: var(--text-primary);
    font-size: 48px;
  }

  .header span{
    flex-grow: 1;
    line-height: 60px;

  }

  .button{
    cursor: pointer;
  }

  .button.user{
    margin-right: 40px;
  }

  .content {
    height: calc(100% - 60px);

    overflow-y: auto;
    overflow-x: hidden;
  }


</style>
