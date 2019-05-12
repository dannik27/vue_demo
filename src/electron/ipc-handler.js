import { ipcMain } from 'electron'
import sqlite from '../../libs/sqlite-aa'

export default {
  init: function(win) {
    sqlite.open(__dirname + '/' + 'db.sqlite').then(r => console.log(r))

    ipcMain.on('persons-get', function(event, arg) {
      sqlite
        .all('SELECT * FROM persons')
        .then(result => win.webContents.send('persons-get-done', result))
    })

    ipcMain.on('persons-save', function(event, person) {
      let insertQuery = "INSERT INTO persons('name', 'age') values(?,?);"

      sqlite
        .run(insertQuery, [person.name, person.age])
        .then(() => win.webContents.send('persons-save-done', 'done'))
    })
  }
}
