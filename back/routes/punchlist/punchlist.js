var express = require('express');
var router = express.Router();
var storage = require('./storage')

var aggregativeRoute = require('./aggregative');

router.use('/form',aggregativeRoute)

router.get('/any/:entity', function (req, res) {

  storage.getAll(req.params.entity)
      .then(docs => res.send(JSON.stringify(docs)));

});

router.get('/any/:entity/:id', function (req, res) {

  storage.getById(req.params.entity, req.params.id)
      .then(doc => res.send(JSON.stringify(doc)))

});

router.get('/image/:id', function (req, res) {

  storage.getById('image', req.params.id)
      .then(doc => res.send(JSON.stringify(doc)));

});

router.get('/schema', function (req, res) {

  storage.getAll('schema')
      .then(docs => res.send(JSON.stringify(docs)));

});

router.get('/schema/:id', function (req, res) {

  storage.getAll('schema', req.params.id)
      .then(doc => res.send(JSON.stringify(doc)));

});

router.get('/schema/:id/image', async function (req, res) {

  let schema = await storage.getById('schema', req.params.id);
  let image = await storage.getById('image', schema.imageId);

  res.send(JSON.stringify(image));
});

router.get('/schema/:id/componentLink', async function (req, res) {

  let componentLinks = await storage.getByQuery('componentLink', {schemaId: parseInt(req.params.id)});

  res.send(JSON.stringify(componentLinks));
});

router.post('/defect/:defectId/defectAction', async function (req, res) {

  let action = req.body;
  action.id = await storage.nextId('defectAction');

  let defectActionType = await storage.getById('defectActionType', action.defectActionTypeId);

  let defect = await storage.getById('defect', req.params.defectId);
  defect.defectActionIds.push(action.id);
  defect.statusId = defectActionType.to;

  await storage.save('defectAction', action);
  storage.save('defect', defect);

  // await storage.update(
  //     'defect',
  //     { id: parseInt(req.params.defectId) },
  //     { $push: { defectActionIds: parseInt(action.id) } });

  res.send(JSON.stringify(action));
});

module.exports = router;