var express = require('express');
var router = express.Router();
var Collection = require('../../../libs/nedb-aa')


let imageStore = new Collection({ filename: __dirname + '/store/image', autoload: true});
let schemaStore = new Collection({ filename: __dirname + '/store/schema', autoload: true});
let componentLinkStore = new Collection({ filename: __dirname + '/store/componentLink', autoload: true});

router.get('/any/:entity', function (req, res) {

  let store = new Collection({ filename: __dirname + '/store/' + req.params.entity, autoload: true});

  store.find({})
      .then(docs => res.send(JSON.stringify(docs)))

});

router.get('/any/:entity/:id', function (req, res) {

  let store = new Collection({ filename: __dirname + '/store/' + req.params.entity, autoload: true});

  store.findOne({id: parseInt(req.params.id)})
      .then(doc => res.send(JSON.stringify(doc)))

});

router.get('/image/:id', function (req, res) {

  imageStore.findOne({id: parseInt(req.params.id)})
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
  let image = await imageStore.findOne({id: schema.imageId});

  res.send(JSON.stringify(image));
});

router.get('/schema/:id/componentLink', async function (req, res) {

  let componentLinks = await componentLinkStore.find({schemaId: parseInt(req.params.id)});

  res.send(JSON.stringify(componentLinks));
});

module.exports = router;