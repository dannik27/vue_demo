import axios from 'axios'

import config from '../../../config'
import store from '../../store/store'
import { dateToString } from '../../utils/formatters'

function getDefaultConfig() {
  let defaultConfig = {
    headers: {}
  }
  defaultConfig.headers.Authorization = localStorage.getItem('token')

  return defaultConfig
}

export default {
  getImage: function(imageId) {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/image/${imageId}`)
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getSchemaList: function() {
    return new Promise(resolve => {
      axios.get(config.BACKEND_URL + `punchlist/schema`).then(response => {
        resolve(response.data)
      })
    })
  },

  getComponentLinks: function(schemaId) {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/schema/${schemaId}/componentLink`)
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getAny: function(entityName) {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/any/${entityName}`)
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

  getAnyById: function(entityName, id) {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/any/${entityName}/${id}`)
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getAnyByQuery: function(entityName, query) {
    return new Promise(resolve => {
      axios
        .post(config.BACKEND_URL + `punchlist/any/${entityName}/query`, query)
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getNewDefectFormData: function(componentId) {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL + `punchlist/form/newDefect/${componentId}`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  postNewDefectForm: function(defect) {
    return new Promise(resolve => {
      axios
        .post(config.BACKEND_URL + `punchlist/form/newDefect`, defect)
        .then(response => {
          resolve(defect)
        })
    })
  },

  getDefectListFormData: function() {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL + `punchlist/form/defectList`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getDefectCardFormData: function(defectId) {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL + `punchlist/form/defectCard/${defectId}`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getSchemaFormData: function(schemaId) {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL + `punchlist/form/schema/${schemaId}`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getComponentLinkWidgetFormData(componentId) {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL +
            `punchlist/form/componentLinkWidget/${componentId}`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getHomeFormData() {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/form/home`, getDefaultConfig())
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getReportFormData() {
    return new Promise(resolve => {
      axios
        .get(config.BACKEND_URL + `punchlist/form/report`, getDefaultConfig())
        .then(response => {
          resolve(response.data)
        })
    })
  },

  getPopupObject: function(entityName, entityId) {
    return new Promise(resolve => {
      axios
        .get(
          config.BACKEND_URL + `punchlist/form/popup/${entityName}/${entityId}`,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  executeDefectAction: function(defectId, actionTypeId, parameters = {}) {
    return new Promise(resolve => {
      let action = {
        datetime: new Date().getTime(),
        defectActionTypeId: actionTypeId,
        parameters
      }

      axios
        .post(
          config.BACKEND_URL + `punchlist/defect/${defectId}/defectAction`,
          action,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  },

  createDefectComment: function(defectId, text) {
    return new Promise(resolve => {
      let comment = {
        datetime: new Date().getTime(),
        text
      }

      axios
        .post(
          config.BACKEND_URL + `punchlist/defect/${defectId}/defectComment`,
          comment,
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
  },

  saveComponentLink: function(schemaId, componentLink) {
    return new Promise(resolve => {
      axios
        .post(
          config.BACKEND_URL + `punchlist/form/newComponentLink/` + schemaId,
          componentLink,
          getDefaultConfig()
        )
        .then(response => {
          resolve(response.data)
        })
    })
  }
}
