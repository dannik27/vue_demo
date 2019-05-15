import axios from 'axios'

import config from '../../../config'
import store from '../../store/store'
import { dateToString } from '../../utils/formatters'

function getDefaultConfig() {
  return {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  }
}

export default {
  _select: function(entityName, payload = {}) {
    return new Promise(resolve => {
      axios
        .post(
          config.BACKEND_URL + `punchlist/select/${entityName}`,
          payload,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  saveAny: function(entityName, object) {
    return new Promise(resolve => {
      axios
        .post(config.BACKEND_URL + `punchlist/any/${entityName}`, object)
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getFormData: function(formName, payload) {
    return new Promise(resolve => {
      axios
        .post(
          config.BACKEND_URL + `punchlist/form/${formName}`,
          payload,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  postFormData: function(formActionName, payload = {}) {
    return new Promise(resolve => {
      axios
        .post(
          config.BACKEND_URL + `punchlist/post/${formActionName}`,
          payload,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  authorize: function(login, password) {
    return new Promise(resolve => {
      let payload = { login, password }

      axios
        .post(
          config.BACKEND_URL + `punchlist/login`,
          payload,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  }
}
