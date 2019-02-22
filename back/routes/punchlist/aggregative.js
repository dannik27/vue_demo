var express = require('express');
var router = express.Router();
var storage = require('./storage')

router.get('/newDefect/:componentId', async function (req, res) {

  try {

    let component = await storage.getById('component', req.params.componentId);
    let subsystem = await storage.getById('subsystem', component.subsystemId);
    let system = await storage.getById('system', subsystem.systemId);
    let facility = await storage.getById('facility', system.facilityId);
    let workshop = await storage.getById('workshop', facility.workshopId);
    let linear = await storage.getById('person', workshop.linearId);
    let contractor = await storage.getById('company', facility.contractorId);
    let disciplines = await storage.getAll('discipline');
    let categories = await storage.getAll('category');

    let response = {
      component,
      linear,
      contractor,
      facility,
      disciplines,
      categories
    }

    res.send(JSON.stringify(response));

  }catch (e) {
    console.log(e)
    res.send(JSON.stringify(e));
  }

});

router.post('/newDefect/', async function (req, res) {

  storage.save('defect', req.body)
      .then(() => res.send('ok'));

});

router.get('/defectList', async function (req, res) {

  let defects = await storage.getAll('defect');

  //todo: сделать асинхронно

  for(let defect of defects) {
    defect.component = await storage.getById('component', defect.componentId);
    defect.initiators = await storage.getByIds('person', defect.initiators);
    defect.category = await storage.getById('category', defect.categoryId);
    defect.discipline = await storage.getById('discipline', defect.disciplineId);
  }

  res.send(defects);

});

module.exports = router;