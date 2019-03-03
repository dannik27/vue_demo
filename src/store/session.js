
function copyObject(src) {
  return src
      ? Object.assign({}, src)
      : null;
}

function copyArray(src) {
  return src
      ? src.slice()
      : null;
}

export default {
  state: {
    user: {
      id:2,
      firstname:"Anatolyi",
      secondname:"Sidorov",
      thirdname:"Ivanovich",
      companyId:1
    }

  },
  mutations: {

    SET_USER(state, user) {
      state.user = copyObject(user);
    }

  },
  actions: {

  }

};