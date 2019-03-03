
let savedState = null;
let redirectResult = null;

let isUserValid = function(user) {
  console.log('User validation:' + !!user)
  return !!user;
}

export default {

  methods : {

    redirect(name, params = {}){
      this.$router.push({name, params})
    },

    redirectForResult(name, params = {}){
      savedState = JSON.parse(JSON.stringify(this.$data));
      this.redirect(name, params)
    },

    backForResult(result){
      redirectResult = result;
      this.$router.go(-1);
    },

    validateCurrentUser: function() {
      let currentUser = this.$store.state.session.user;

      if(! isUserValid(currentUser)){
        this.$router.push('/punchlist/authorization');
      }
    },

    logout: function() {
      this.$store.commit('SET_USER', null);
      this.validateCurrentUser();
    }
  },

  created: function () {
    this.validateCurrentUser();

  },

  beforeDestroy: function () {
  },

  mounted: function () {

    if(savedState && redirectResult){

      Object.entries(savedState).forEach((key, value) => {
        this.$data[key[0]] = key[1];
      });
      this.redirectResult(redirectResult);

      savedState = null;
      redirectResult = null;
    }


  }

}