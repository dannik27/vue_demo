
import { ipcRenderer } from 'electron'

export default {

  getPersons : function() {
    return new Promise(resolve => {
      ipcRenderer.send("persons-get")

      ipcRenderer.on("persons-get-done", function (event, response) {
        resolve(response)
      })
    })
  },

  savePerson: function(person) {
    return new Promise(resolve => {
      ipcRenderer.send("persons-save", person)

      ipcRenderer.on("persons-save-done", function (event, response) {
        resolve(response)
      })

    })
  }
}