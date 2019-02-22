<template>
  <div>

    <div class="list">
      <DefectListItem
              v-for="defect in defects"
              v-bind:key="defect.id"
              v-bind:defect="defect"
              class="item"
              @click.native="clickOnCard" />

    </div>


  </div>

</template>

<script>

  import DefectListItem from './defect-list-item'

  import api from '../../services/backend/punchlist-api'

export default {
    components: {
      DefectListItem
    },
    data () {
        return {
          defects: []
        }
    },
    methods : {
      clickOnCard: function() {
        this.$router.push('/punchlist/defect-card')
      }
    },
    mounted() {
      this.$store.commit('setTitle', 'Defect list')

      api.getDefectListFormData()
          .then(res => this.defects = res)
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

    padding-bottom: 10px;

  }

  .item{
    margin-top: 20px;
    flex-basis: 440px;
    max-width: 440px;
  }


</style>
