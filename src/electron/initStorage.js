var rimraf = require('rimraf')
var fs = require('fs')

var Collection = require('../../libs/nedb-aa')

var structure = require('../../shared/structure')

rimraf(__dirname + '/store', async function() {
  Object.keys(structure).forEach(entityName => {
    new Collection({
      filename: __dirname + '/store/' + entityName,
      autoload: true
    })
  })
})
