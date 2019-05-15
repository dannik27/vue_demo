import remoteApi from './backend/punchlist-api'
//import localApi from './electron/punchlist-api'

export default {
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

  _select: function(entityName, payload = {}) {
    return remoteApi._select(entityName, payload)
  },

  saveAny: function(entityName, object) {
    return remoteApi.saveAny(entityName, object)
  },

  getFormData: function(formName, payload) {
    return remoteApi.getFormData(formName, payload)
  },

  postFormData: function(formActionName, payload = {}) {
    return remoteApi.postFormData(formActionName, payload)
  },

  authorize: function(login, password) {
    return remoteApi.authorize(login, password)
  }
}
