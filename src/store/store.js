import Vue from 'vue'
import Vuex from 'vuex'

import sessionStore from './session'

import api from '../services/backend/demo-api'

Vue.use(Vuex)

function copyObject(src) {
  return Object.assign({}, src)
}

function copyArray(src) {
  return src.slice()
}

export default new Vuex.Store({
  modules: {
    session: sessionStore
  },
  state: {
    savedComponentState: null,
    persons: [],
    title: 'PunchList'
  },
  mutations: {
    SET_SAVED_COMPONENT_STATE(state, componentState) {
      state.savedComponentState = copyObject(componentState)
    },

    setPersons(state, persons) {
      state.persons = copyArray(persons)
    },

    addPerson(state, person) {
      state.persons.push(person)
    },

    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    fetchPersons({ commit }) {
      api.getPersons().then(resp => commit('setPersons', resp))
    },

    postPerson({ commit }, person) {
      let copy = copyObject(person)

      api.savePerson(copy).then(resp => commit('addPerson', copy))
    }
  }
})
