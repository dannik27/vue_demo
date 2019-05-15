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
  defaultSelectPayload: {
    sort: {
      id: 1
    },
    // conditions:[
    //   {
    //     field: 'field1',
    //     operator: 'equals',
    //     value: 'value'
    //   }
    // ],
    single: false
  },

  selectQuery: function(entityName) {
    class Builder {
      constructor(entityName, api) {
        this.entityName = entityName
        this.sort = {}
        this.conditions = []
        this.single = false
        this.api = api
      }

      addSort(fieldName, direction) {
        if (![-1, 1].includes(direction)) {
          throw new Error('direction can be -1 or 1, not ' + direction)
        }
        this.sort[fieldName] = direction
        return this
      }

      addCondition(field, operator, value) {
        if (!['equals'].includes(operator)) {
          throw new Error('invalid condition operator ' + operator)
        }
        this.conditions.push({
          field,
          operator,
          value
        })
        return this
      }

      build() {
        return {
          entityName: this.entityName,
          sort: this.sort,
          conditions: this.conditions,
          single: this.single
        }
      }

      findOne() {
        this.single = true
        return this.api._select(this.entityName, this.build())
      }

      findAll() {
        this.single = false
        return this.api._select(this.entityName, this.build())
      }
    }
    return new Builder(entityName, this)
  },

  // DEPRECATED - use query
  _select: function(entityName, payload = {}) {
    let resultPayload = {}
    return new Promise(resolve => {
      axios
        .post(
          config.BACKEND_URL + `punchlist/select/${entityName}`,
          Object.assign(resultPayload, this.defaultSelectPayload, payload),
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
          config.BACKEND_URL + `punchlist/form/${formActionName}`,
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
