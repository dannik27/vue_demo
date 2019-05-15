var rimraf = require('rimraf')
var fs = require('fs')

var Collection = require('../../../libs/nedb-aa')

var demodata = require('./demo-data/demo.json')

rimraf(__dirname + '/store', async function() {
  let images = []
  let n = 1
  while (n < 6) {
    images.push({
      text: `schema${n}`,
      id: '00000000-0000-0000-0000-00000000080' + n, // Число n меньше 10
      base64: fs.readFileSync(
        __dirname + `/demo-data/schema${n}.png`,
        'base64'
      ),
      dateModified: new Date().getTime()
    })
    n += 1
  }

  let imageStore = new Collection({
    filename: __dirname + '/store/image',
    autoload: true
  })
  imageStore.insert(images)

  Object.keys(demodata).forEach(entityName => {
    let objects = demodata[entityName].map(object => {
      object.dateModified = new Date().getTime()
      return object
    })

    let store = new Collection({
      filename: __dirname + '/store/' + entityName,
      autoload: true
    })
    store.insert(objects)
  })
})
