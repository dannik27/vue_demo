<template>
  <div>
    <div class="menu">
      <router-link to="/punchlist/schema-list" tag="button" class="custom-button">schemas</router-link>
      <router-link to="/punchlist/defect-list" tag="button" class="custom-button">defects</router-link>
      <button class="custom-button" @click="logout">logout</button>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'

export default {
  mixins: [screenMixin],
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {
    this.$store.commit('setTitle', 'PunchList')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu {
  display: flex;
  justify-content: space-evenly;
  padding-top: 10px;
}
</style>
