import { ipcMain } from 'electron'
import sqlite from '../../libs/sqlite-aa'

import NeDBService from '../../shared/db/nedb-service'
let nedbService = new NeDBService(__dirname + '/store')

export default {
  init: async function(win) {
    // sqlite.open(__dirname + '/' + 'db.sqlite').then(r => console.log(r))

    // ipcMain.on('persons-get', function(event, arg) {
    //   sqlite
    //     .all('SELECT * FROM persons')
    //     .then(result => win.webContents.send('persons-get-done', result))
    // })

    // ipcMain.on('persons-save', function(event, person) {
    //   let insertQuery = "INSERT INTO persons('name', 'age') values(?,?);"

    //   sqlite
    //     .run(insertQuery, [person.name, person.age])
    //     .then(() => win.webContents.send('persons-save-done', 'done'))
    // })

    ipcMain.on('form', async function(event, message) {
      let { token, payload, formName, key } = message

      let user = await nedbService.getUserInfo(token)
      if (!user) {
        win.webContents.send(`form-${key}-fail`, 'Invalid token')
        return
      }

      let response = null
      switch (formName) {
        case 'home':
          response = await nedbService.getHomeFormData(user)
          break
        case 'defectList':
          response = await nedbService.getDefectListFormData(user)
          break
        case 'searchWidget':
          response = await nedbService.getSearchWidgetFormData(user, payload)
          break
        case 'schema':
          response = await nedbService.getSchemaFormData(user, payload)
          break
        case 'componentLinkWidget':
          response = await nedbService.getComponentLinkWidgetFormData(
            user,
            payload
          )
          break
        case 'newDefect':
          response = await nedbService.getNewDefectFormData(user, payload)
          break
        case 'defectCard':
          response = await nedbService.getDefectCardFormData(user, payload)
          break
        case 'popup':
          response = await nedbService.getPopupFormData(user, payload)
          break
        case 'report':
          response = await nedbService.getReportFormData(user, payload)
          break
      }

      if (response) {
        console.log('ipc-' + formName)
        console.log(Object.keys(response))
        win.webContents.send(`form-${key}-ok`, response)
      } else {
        win.webContents.send(
          'form-fail',
          'Can not get form data. form name: ' + formName
        )
      }
    })
  }
}
