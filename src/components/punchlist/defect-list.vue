<template>
  <div>

    <div class="list">
      <DefectListItem class="item" @click.native="clickOnCard" />
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard" />
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard" />
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
      <DefectListItem class="item" @click.native="clickOnCard"/>
    </div>


  </div>

</template>

<script>

  import DefectListItem from './defect-list-item'

export default {
    components: {
      DefectListItem
    },
    data () {
        return {

        }
    },
    methods : {
      clickOnCard: function() {
        this.$router.push('/punchlist/defect-card')
      }
    },
    mounted() {
      this.$store.commit('setTitle', 'Defect list')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .list{

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    overflow: hidden;

  }

  .item{
    margin-top: 20px;
    flex-basis: 440px;
    max-width: 440px;
  }


</style>
