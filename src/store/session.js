function copyObject(src) {
  return src ? Object.assign({}, src) : null
}

function copyArray(src) {
  return src ? src.slice() : null
}

export default {
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = copyObject(user)
    }
  },
  actions: {}
}
