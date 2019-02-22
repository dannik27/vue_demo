
import axios from "axios"

import config from "../../config"

export default {

  getImage: function(imageId) {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/image/${imageId}`).then(response=>{
        resolve(response.data);
      })
    })
  },

  getSchemaList: function() {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/schema`).then(response=>{
        resolve(response.data);
      })
    })
  },

  getComponentLinks: function(schemaId) {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/schema/${schemaId}/componentLink`).then(response=>{
        resolve(response.data);
      })
    })
  },

  getAny: function (entityName) {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/any/${entityName}`).then(response=>{
        resolve(response.data);
      })
    })
  },

  getAnyById: function (entityName, id) {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/any/${entityName}/${id}`).then(response=>{
        resolve(response.data);
      })
    })
  },

  getNewDefectFormData: function (componentId) {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/form/newDefect/${componentId}`).then(response=>{
        resolve(response.data);
      })
    })
  },

  postNewDefectForm: function(defect) {
    return new Promise(resolve => {

      axios.post(config.BACKEND_URL + `punchlist/form/newDefect`, defect).then(response=>{
        resolve(defect);
      })
    })
  },

  getDefectListFormData: function () {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + `punchlist/form/defectList`).then(response=>{
        resolve(response.data);
      })
    })
  },
}