var express = require('express');
var router = express.Router();
var Collection = require('../../../libs/nedb-aa')

var fs = require('fs');
var demodata = require('./demo-data/demo.json');


let imagesStore = new Collection({ filename: __dirname + '/store/images', autoload: true});
let schemaStore = new Collection({ filename: __dirname + '/store/schemas', autoload: true});
let componentLinkStore = new Collection({ filename: __dirname + '/store/componentLink', autoload: true});


router.get('/image/:id', function (req, res) {

  imagesStore.findOne({id: parseInt(req.params.id)})
      .then(doc => res.send(JSON.stringify(doc)));

});

router.get('/schema', function (req, res) {

  schemaStore.find({})
      .then(docs => res.send(JSON.stringify(docs)));

});

router.get('/schema/:id', function (req, res) {

  schemaStore.findOne({id: parseInt(req.params.id)})
      .then(doc => res.send(JSON.stringify(doc)));

});

router.get('/schema/:id/image', async function (req, res) {

  let schema = await schemaStore.findOne({id: parseInt(req.params.id)});
  let image = await imagesStore.findOne({id: schema.imageId});

  res.send(JSON.stringify(image));
});

router.get('/schema/:id/componentLink', async function (req, res) {

  let componentLinks = await componentLinkStore.find({schemaId: parseInt(req.params.id)});

  res.send(JSON.stringify(componentLinks));
});



router.get('/init', async function (req, res) {

  await Promise.all([
      imagesStore.remove({}, { multi: true }),
      schemaStore.remove({}, { multi: true }),
      componentLinkStore.remove({}, { multi: true })]
  )

  imagesStore.remove({});

  let images = [];
  let n = 1;
  while(n < 6) {
    images.push({
      name: `schema${n}`,
      id: n,
      base64: fs.readFileSync(__dirname + `/demo-data/schema${n}.png`, 'base64')
    });
    n+=1;
  }

  Promise.all([
      imagesStore.insert(images),
      schemaStore.insert(demodata.schema),
      componentLinkStore.insert(demodata.componentLink)]
  ).then(() => res.send('ok'))


})


module.exports = router;