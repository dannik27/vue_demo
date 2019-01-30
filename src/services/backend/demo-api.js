
import axios from "axios"

import config from "../../config"

export default {

  getPersons: function() {
    return new Promise(resolve => {

      axios.get(config.BACKEND_URL + 'persons').then(response=>{
        resolve(response.data);
      })
    })
  },

  savePerson: function(person) {
    return new Promise(resolve=>{

      axios.post(config.BACKEND_URL + 'persons', person)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            console.log(error);
          });
    })
  }
}