import { resolve } from 'q'

let savedState = null
let redirectResult = null

export default {
  data() {
    return {
      loader: null,
      meta: {
        loading: false,
        persistFields: []
      }
    }
  },
  methods: {
    toggleLoader() {
      if (this.meta.loading) {
        this.loader = this.$loading.show({})
      }
    },

    readyToRender() {
      this.meta.loading = false
      this.loader.hide()
    },

    redirect(name, params = {}) {
      this.$router.push({ name, params })
    },

    redirectForResult(name, params = {}) {
      savedState = {}

      for (let field of this.meta.persistFields) {
        savedState[field] = JSON.parse(JSON.stringify(this.$data[field]))
      }

      this.redirect(name, params)
    },

    backForResult(result) {
      redirectResult = result
      this.$router.go(-1)
    },

    setTitle(newTitle) {
      this.$store.commit('setTitle', newTitle)
    },

    isUserValid(user) {
      console.log('User validation:' + !!user)
      return !!user
    },

    invalidateToken() {
      return new Promise((resolve, reject) => {
        let token = localStorage.getItem('token')

        if (token) {
          resolve()
        } else {
          reject()
        }
      })
    },

    validateCurrentUser: function() {
      this.invalidateToken()
        .then(() => {})
        .catch(() => {
          this.$router.push('/punchlist/authorization')
        })
    },

    logout: function() {
      this.$store.commit('SET_USER', null)
      localStorage.removeItem('token')
      this.validateCurrentUser()
    }
  },

  created: function() {},

  beforeDestroy: function() {},

  mounted: function() {
    this.toggleLoader()

    if (savedState && redirectResult) {
      Object.entries(savedState).forEach((key, value) => {
        this.$data[key[0]] = key[1]
      })
      this.redirectResult(redirectResult)

      savedState = null
      redirectResult = null
    }
  }
}
