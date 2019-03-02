
export default {

  methods : {
    validateCurrentUser: function() {
      let currentUser = this.$store.state.session.user;

      if(! this.isUserValid(currentUser)){
        this.$router.push('/punchlist/authorization');
      }
    },

    isUserValid: function(user) {
      console.log('User validation:' + !!user)
      return !!user;
    },

    logout: function() {
      this.$store.commit('SET_USER', null);
      this.validateCurrentUser();
    }
  },

  created: function () {
    this.validateCurrentUser();

  }

}