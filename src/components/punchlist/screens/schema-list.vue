<template>
  <div class="root">

    <div class="list">
      <SchemaListItem
              v-bind:named="schema"
              v-bind:key="schema.id"
              v-for="schema in schemas"
              class="item"
              @click.native="clickOnCard(schema.id)"
      />
    </div>


  </div>

</template>

<script>

  import screenMixin from '../../../mixins/screen-mixin'
  import SchemaListItem from '../schema-list-item'

  import api from '../../../services/backend/punchlist-api'

export default {
    mixins: [screenMixin],
    components: {
      SchemaListItem
    },
    data () {
        return {
          schemas: []
        }
    },
    methods : {
      clickOnCard: function(schemaId) {
        this.$router.push('/punchlist/schema/' + schemaId)
      }
    },
    mounted() {
      this.$store.commit('setTitle', 'Schema list')

      api.getSchemaList()
          .then(response => this.schemas = response)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .root{
    height: 100%;
  }

  .list{

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    overflow: hidden;

    padding-bottom: 10px;

  }

  .item{
    margin-top: 20px;
    flex-basis: 500px;
    max-width: 500px;
  }


</style>
