
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

}