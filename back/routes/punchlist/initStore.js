var rimraf = require('rimraf');
var fs = require('fs');

var Collection = require('../../../libs/nedb-aa')

var demodata = require('./demo-data/demo.json');



rimraf(__dirname + '/store', async function () {

  let images = [];
  let n = 1;
  while(n < 6) {
    images.push({
      text: `schema${n}`,
      id: n,
      base64: fs.readFileSync(__dirname + `/demo-data/schema${n}.png`, 'base64')
    });
    n+=1;
  }

  let imageStore = new Collection({ filename: __dirname + '/store/image', autoload: true});
  imageStore.insert(images);


  Object.keys(demodata).forEach(entityName => {

    let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});
    store.insert(demodata[entityName]);
  });

});