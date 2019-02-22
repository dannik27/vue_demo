
function copyObject(src) {
  return Object.assign({}, src);
}

function copyArray(src) {
  return src.slice();
}

export default {
  state: {
    user: {
      id: 1,
      name: "Petrov E.E."
    }
  },
  mutations: {

    setUser(state, user) {
      state.user = copyObject(user);
    }

  },
  actions: {

  }

};