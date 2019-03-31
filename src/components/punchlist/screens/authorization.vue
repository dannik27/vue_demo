<template>
  <div class="root">
    <div class="custom-panel">
      <input
        @keyup.enter="authorize"
        autofocus
        placeholder="login"
        v-model="login"
        type="text"
      />
      <input
        @keyup.enter="authorize"
        placeholder="password"
        v-model="password"
        type="text"
      />
      <p v-if="incorrectCredentials">Login or password is incorrect</p>
      <button class="custom-button" @click="authorize">Log in</button>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'
import api from '../../../services/backend/punchlist-api'

export default {
  mixins: [screenMixin],
  components: {},
  data() {
    return {
      login: '',
      password: '',
      incorrectCredentials: false
    }
  },
  methods: {
    authorize: function() {
      api.authorize(this.login, this.password).then(result => {
        if (result) {
          this.$store.commit('SET_USER', result)
          localStorage.setItem('token', result.token)
          this.redirect()
        } else {
          this.incorrectCredentials = true
        }
      })
    },

    redirect: function() {
      this.$router.push('/punchlist/home')
    }
  },
  mounted() {
    this.$store.commit('setTitle', 'PunchList')

    this.invalidateToken()
      .then(() => this.redirect())
      .catch(() => console.log('need auth'))

    api.getFormData('lel', {kek: 'shmek'})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.root div {
  width: 300px;
  height: 200px;

  display: flex;
  flex-flow: column;

  justify-content: space-evenly;
}

.root div p {
  color: red;
  margin-bottom: 0px;
}
</style>
