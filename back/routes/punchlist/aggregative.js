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
    defect.initiators = await storage.getByIds('person', defect.initiatorIds);
    defect.category = await storage.getById('category', defect.categoryId);
    defect.discipline = await storage.getById('discipline', defect.disciplineId);
    defect.status = await storage.getById('status', defect.disciplineId);
  }

  res.send(defects);

});

function getUserRoleInDefect(user, defect, facility, workshop){

  if(facility.contractorId === user.companyId){
    return 4;
  }else if(defect.contractorId === user.id){
    return 3;
  }else if(workshop.linearId === user.id){
    return 2;
  }else if(defect.initiatorIds.includes(user.id)){
    return 1;
  }else{
    return -1;
  }
}

router.get('/defectCard/:defectId', async function (req, res) {

  // let user = await storage.getById('person', req.get('Authorization'));
  let user = await storage.getById('person', 1);


  let defect = await storage.getById('defect', req.params.defectId);

  let component = await storage.getById('component', defect.componentId);
  let subsystem = await storage.getById('subsystem', component.subsystemId);
  let system = await storage.getById('system', subsystem.systemId);
  let facility = await storage.getById('facility', system.facilityId);
  let workshop = await storage.getById('workshop', facility.workshopId);

  defect.component = component;
  defect.facility = facility;
  defect.discipline = await storage.getById('discipline', defect.disciplineId);
  defect.category = await storage.getById('category', defect.categoryId);
  defect.initiators = await storage.getByIds('person', defect.initiatorIds);
  defect.linear = await storage.getById('person', workshop.linearId);
  defect.contractor = await storage.getById('company', facility.contractorId);
  defect.status = await storage.getById('status', defect.statusId);

  defect.defectActions = await storage.getByIds('defectAction', defect.defectActionIds);
  defect.defectComments = await storage.getByIds('defectComment', defect.defectCommentIds);

  let userRole = getUserRoleInDefect(user, defect, facility, workshop);


  let actionsQuery = {
    $and: [
        {roles: {$elemMatch : userRole}},
        {from: defect.statusId}
    ]
  };

  defect.availableActions = await storage.getByQuery('defectActionType', actionsQuery);

  res.send(defect);

});

module.exports = router;