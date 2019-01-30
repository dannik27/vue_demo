
import { ipcMain } from 'electron'

let persons = [
  {
    id: 1,
    name: "Vasya electron",
    age: 21
  },
  {
    id: 2,
    name: "Petya electron",
    age: 43
  },
  {
    id: 3,
    name: "Misha electron",
    age: 14
  }
];

export default {
  init: function(win){

    ipcMain.on('persons-get', function (event, arg) {
      win.webContents.send('persons-get-done', persons)
    })

    ipcMain.on('persons-save', function (event, payload) {
      persons.push(payload);
      win.webContents.send('persons-save-done', "done")
    })

  }

}