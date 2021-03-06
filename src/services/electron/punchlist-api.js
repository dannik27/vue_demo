import { ipcRenderer } from 'electron'

function getToken() {
  return localStorage.getItem('token')
}

let counter = 1

export default {
  _counter: 1,

  _sendMessage: function(messageId, message) {
    return new Promise((resolve, reject) => {
      let key = counter++
      message.key = key

      ipcRenderer.send(messageId, message)
      console.log('ipc request')
      console.log(message)
      ipcRenderer.on(`${messageId}-${key}-ok`, function(event, response) {
        console.log('ipc response')
        console.log(response)
        resolve(response)
      })

      ipcRenderer.on(`${messageId}-${key}-fail`, function(event, error) {
        console.log('ipc error: ' + error)
        reject(error)
      })
    })
  },

  _select: function(entityName, payload = {}) {
    return this._sendMessage('select', {
      token: getToken(),
      payload,
      entityName
    })
  },

  saveAny: function(entityName, object) {
    return this._sendMessage('postAny', {
      token: getToken(),
      payload,
      entityName
    })
  },

  getFormData: function(formName, payload) {
    return this._sendMessage('form', {
      token: getToken(),
      payload,
      formName
    })
  },

  postFormData: function(entityName, payload = {}) {
    return this._sendMessage('post', {
      token: getToken(),
      payload,
      entityName
    })
  },

  authorize: function(login, password) {
    return this._sendMessage('login', {
      payload: { login, password }
    })
  }
}
