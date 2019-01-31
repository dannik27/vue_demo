import Vue from 'vue'
import Vuex from 'vuex';

import api from '../services/electron/demo-api'

Vue.use(Vuex);

function copyObject(src) {
  return Object.assign({}, src);
}

function copyArray(src) {
  return src.slice();
}

export default new Vuex.Store({
  state: {
    persons: []
  },
  mutations: {

    setPersons(state, persons) {
      state.persons = copyArray(persons);
    },
    addPerson(state, person) {
      state.persons.push(person)
    }
  },
  actions: {
    fetchPersons({commit}) {
      api.getPersons()
          .then(resp => commit('setPersons', resp))
    },

    postPerson({commit}, person) {
      let copy = copyObject(person)

      api.savePerson(copy)
          .then(resp => commit('addPerson', copy))

    }
  }

});