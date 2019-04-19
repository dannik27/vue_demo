var express = require('express')
var router = express.Router()
var storage = require('./storage')

async function getUserInfo(request) {
  let token = request.get('Authorization')

  if (!token) {
    return null
  }

  let credentials = await storage.getById('credentials', parseInt(token))

  if (!credentials) {
    return null
  }

  return await storage.getById('person', credentials.personId)
}

router.post('/schema', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let schemaId = req.body.schemaId

  let schema = await storage.getById('schema', schemaId)
  schema.image = await storage.getById('image', schema.imageId)
  schema.marks = await storage.getByIds('mark', schema.markIds)
  schema.subsystems = await storage.getByIds('subsystem', schema.subsystemIds)

  res.send(JSON.stringify(schema))
})

router.post('/newDefect', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let componentId = parseInt(req.body.componentId)

  try {
    let component = await storage.getById('component', componentId)
    let subsystem = await storage.getById('subsystem', component.subsystemId)
    let system = await storage.getById('system', subsystem.systemId)
    let facility = await storage.getById('facility', system.facilityId)
    let workshop = await storage.getById('workshop', facility.workshopId)
    let linear = await storage.getById('person', workshop.linearId)
    let contractor = await storage.getById('company', facility.contractorId)

    let response = {
      component,
      linear,
      contractor,
      facility,
      disciplines: await storage.getAll('discipline'),
      categories: await storage.getAll('category'),
      user
    }

    res.send(JSON.stringify(response))
  } catch (e) {
    console.log(e)
    res.send(JSON.stringify(e))
  }
})

router.post('/createDefect/', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let defect = req.body

  for (let [i, attachment] of defect.attachments.entries()) {
    attachment.datetime = defect.datetime + 1 + i
  }

  let attachments = await storage.saveAll('attachment', defect.attachments)

  delete defect.attachments
  defect.attachmentIds = attachments.map(image => image.id)

  let defectActions = [
    {
      datetime: defect.datetime,
      personId: defect.initiatorIds[0],
      defectActionTypeId: 1
    },
    {
      datetime: defect.datetime + 10,
      personId: defect.initiatorIds[0],
      defectActionTypeId: 2
    }
  ]

  defectActions = await storage.saveAll('defectAction', defectActions)
  defect.defectActionIds = defectActions.map(da => da.id)

  if (!defect.defectCommentsIds) {
    defect.defectCommentIds = []
  }

  defect.statusId = 2

  storage.save('defect', defect).then(() => res.send('ok'))
})

router.post('/defectList', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let defects = await storage.getAll('defect')

  //todo: сделать асинхронно

  for (let defect of defects) {
    defect.component = await storage.getById('component', defect.componentId)
    defect.initiators = await storage.getByIds('person', defect.initiatorIds)
    defect.category = await storage.getById('category', defect.categoryId)
    defect.discipline = await storage.getById('discipline', defect.disciplineId)
    defect.status = await storage.getById('status', defect.statusId)

    // get user role

    let subsystem = await storage.getById(
      'subsystem',
      defect.component.subsystemId
    )
    let system = await storage.getById('system', subsystem.systemId)

    defect.userRole = getUserRoleInDefect(user, defect)

    // TODO: nekrasivo
    // add system

    defect.system = system
  }

  defects = defects.sort((a, b) => {
    return a.datetime > b.datetime ? -1 : 1
  })

  res.send(defects)
})

function getUserRoleInDefect(user, defect) {
  if (
    defect.contractorId === user.companyId &&
    user.systemRoleIds.includes(3)
  ) {
    return 4
  } else if (defect.executorId === user.id) {
    return 3
  } else if (defect.linearId === user.id) {
    return 2
  } else if (defect.initiatorIds.includes(user.id)) {
    return 1
  } else {
    return -1
  }
}

router.post('/defectCard', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let defectId = req.body.defectId

  let defect = await storage.getById('defect', defectId)

  let component = await storage.getById('component', defect.componentId)
  let subsystem = await storage.getById('subsystem', component.subsystemId)
  let system = await storage.getById('system', subsystem.systemId)
  let facility = await storage.getById('facility', system.facilityId)
  let workshop = await storage.getById('workshop', facility.workshopId)

  defect.component = component
  defect.facility = facility
  defect.discipline = await storage.getById('discipline', defect.disciplineId)
  defect.category = await storage.getById('category', defect.categoryId)
  defect.initiators = await storage.getByIds('person', defect.initiatorIds)
  defect.linear = await storage.getById('person', workshop.linearId)
  defect.contractor = await storage.getById('company', facility.contractorId)
  defect.status = await storage.getById('status', defect.statusId)
  defect.executor = await storage.getById('person', defect.executorId)

  defect.markId = (await storage.getByQuery('mark', {
    entityName: 'component',
    objectId: parseInt(component.id)
  }))[0].id
  defect.schemaId = (await storage.getByQuery('schema', {
    markIds: { $elemMatch: defect.markId }
  }))[0].id

  if (defect.status.tag === 'APPROVED') {
    let contractorMembersQuery = {
      $and: [
        { systemRoleIds: { $elemMatch: 5 } },
        { companyId: defect.contractor.id }
      ]
    }

    defect.contractor.members = await storage.getByQuery(
      'person',
      contractorMembersQuery
    )
  }

  defect.attachments = await storage.getByIds(
    'attachment',
    defect.attachmentIds
  )
  for (let attachment of defect.attachments) {
    attachment.person = await storage.getById('person', attachment.personId)
  }

  defect.defectActions = await storage.getByIds(
    'defectAction',
    defect.defectActionIds
  )

  for (let action of defect.defectActions) {
    action.defectActionType = await storage.getById(
      'defectActionType',
      action.defectActionTypeId
    )
    action.defectActionType.to = await storage.getById(
      'status',
      action.defectActionType.to
    )
    action.person = await storage.getById('person', action.personId)
  }

  defect.defectComments = await storage.getByIds(
    'defectComment',
    defect.defectCommentIds
  )

  for (let comment of defect.defectComments) {
    comment.person = await storage.getById('person', comment.personId)
  }

  let userRole = getUserRoleInDefect(user, defect)

  let actionsQuery = {
    $and: [{ roles: { $elemMatch: userRole } }, { from: defect.statusId }]
  }

  defect.availableActions = await storage.getByQuery(
    'defectActionType',
    actionsQuery
  )

  res.send(defect)
})

router.post('/createDefectAction', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let action = req.body
  action.personId = user.id

  let params = action.parameters
  delete action.parameters

  let defectId = params.defectId

  let defectActionType = await storage.getById(
    'defectActionType',
    action.defectActionTypeId
  )

  action = await storage.save('defectAction', action)

  let defect = await storage.getById('defect', defectId)
  defect.defectActionIds.push(action.id)
  defect.statusId = defectActionType.to

  if (defectActionType.id == 6) {
    defect.executorId = params.contractorMemberId
    defect.estimatedDueDate = params.estimatedDueDate
  }

  await storage.save('defect', defect)

  res.send(JSON.stringify(action))
})

router.post('/createDefectComment', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let comment = req.body
  comment.personId = user.id

  let defectId = comment.defectId
  delete comment.defectId

  comment = await storage.save('defectComment', comment)

  let defect = await storage.getById('defect', defectId)
  defect.defectCommentIds.push(comment.id)

  await storage.save('defect', defect)

  res.send(JSON.stringify(comment))
})

router.post('/createMark', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let mark = req.body.mark
  let schemaId = parseInt(req.body.schemaId)

  if (mark.object) {
    let object = await storage.save(mark.entityName, mark.object)
    mark.objectId = object.id
    delete mark.object
  }

  mark = await storage.save('mark', mark)
  let schema = await storage.getById('schema', schemaId)
  schema.markIds.push(mark.id)
  storage.save('schema', schema)

  res.send(mark)
})

router.post('/componentLinkWidget', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let componentId = req.body.componentId

  let component = await storage.getById('component', componentId)

  let defects = await storage.getByQuery('defect', {
    componentId: parseInt(component.id)
  })

  for (let defect of defects) {
    defect.initiators = await storage.getByIds('person', defect.initiatorIds)
    defect.status = await storage.getById('status', defect.statusId)
  }

  component.defects = defects

  res.send(component)
})

router.post('/searchWidget', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let schemaId = parseInt(req.body.schemaId)

  let schema = await storage.getById('schema', schemaId)
  let marks = await storage.getByIds('mark', schema.markIds)

  for (let mark of marks) {
    mark.object = await storage.getById(mark.entityName, mark.objectId)
  }

  res.send(marks)
})

router.post('/popup', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let entityName = req.body.entityName
  let entityId = parseInt(req.body.entityId)

  if (entityName == 'defect') {
    let defect = await storage.getById('defect', entityId)
    defect.status = await storage.getById('status', defect.statusId)
    defect.initiators = await storage.getByIds('person', defect.initiatorIds)
    res.send(defect)
  } else if (entityName == 'schemaComment') {
    let comment = await storage.getById('schemaComment', entityId)
    comment.person = await storage.getById('person', comment.personId)
    res.send(comment)
  } else if (entityName == 'schema') {
    let schema = await storage.getById('schema', entityId)
    res.send(schema)
  } else {
    res.status(404).send('Invalid entity name: ' + entityName)
  }
})

router.post('/home', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Token is not present')
  }

  user.company = await storage.getById('company', user.companyId)

  let defects = await storage.getAll('defect')
  let statuses = await storage.getAll('status')

  let waitsForMe = defects.filter(defect => {
    let role = getUserRoleInDefect(user, defect)
    return (
      statuses.filter(
        status =>
          status.id === defect.statusId && status.responsibleRole === role
      ).length > 0
    )
  })

  for (let defect of waitsForMe) {
    defect.component = await storage.getById('component', defect.componentId)
    defect.initiators = await storage.getByIds('person', defect.initiatorIds)
    defect.category = await storage.getById('category', defect.categoryId)
    defect.discipline = await storage.getById('discipline', defect.disciplineId)
    defect.status = await storage.getById('status', defect.statusId)

    defect.userRole = getUserRoleInDefect(user, defect)
  }

  defects = defects.sort((a, b) => {
    return a.datetime > b.datetime ? -1 : 1
  })

  res.send({ user, waitsForMe })
})

router.post('/report', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Token is not present')
  }

  let response = []

  let defects = await storage.getAll('defect')
  let disciplines = await storage.getAll('discipline')
  let categories = await storage.getAll('category')
  let components = await storage.getAll('component')
  let subsystems = await storage.getAll('subsystem')
  let systems = await storage.getAll('system')
  let statuses = await storage.getAll('status')

  for (let defect of defects) {
    let component = components.find(el => el.id == defect.componentId)
    let subsystem = subsystems.find(el => el.id == component.subsystemId)
    let system = systems.find(el => el.id == subsystem.systemId)
    let discipline = disciplines.find(el => el.id == defect.disciplineId)
    let category = categories.find(el => el.id == defect.categoryId)
    let status = statuses.find(el => el.id == defect.statusId)

    let systemRow = response.find(el => el.id == system.id)
    if (!systemRow) {
      systemRow = {
        id: system.id,
        name: system.name,
        disciplines: [],
        values: {
          total: 0,
          actual: 0,
          a: 0,
          b: 0,
          c: 0
        }
      }
      response.push(systemRow)
    }
    let disciplineRow = systemRow.disciplines.find(el => el.id == discipline.id)
    if (!disciplineRow) {
      disciplineRow = {
        id: discipline.id,
        name: discipline.name,
        total: 0,
        actual: 0,
        a: 0,
        b: 0,
        c: 0
      }
      systemRow.disciplines.push(disciplineRow)
    }

    let isActual = !['CLOSED', 'CONFIRMED'].includes(status.tag)
    let categoryTag
    switch (category.tag) {
      case 'A1':
        categoryTag = 'a'
        break
      case 'B1':
        categoryTag = 'b'
        break
      case 'C1':
        categoryTag = 'c'
        break
    }

    // add defect to report

    disciplineRow.total += 1
    if (isActual) disciplineRow.actual += 1
    disciplineRow[categoryTag] += 1

    systemRow.values.total += 1
    if (isActual) systemRow.values.actual += 1
    systemRow.values[categoryTag] += 1
  }

  Array.prototype.push.apply(
    response,
    require('../../../resources/fake-report')
  )

  res.send(response)
})

router.post('/lel', async function(req, res) {
  console.log(req.body)
  console.log('sdas')

  res.send('ok')
})

module.exports = router
