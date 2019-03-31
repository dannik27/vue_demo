var express = require('express')
var router = express.Router()
var storage = require('./storage')

var aggregativeRoute = require('./aggregative')

router.use('/form', aggregativeRoute)

async function getUserInfo(request) {
  let token = request.get('Authorization')

  if (!token) {
    return null
  }

  let credentials = await storage.getById('credentials', parseInt(token))
  console.log(credentials)

  if (!credentials) {
    return null
  }

  return await storage.getById('person', credentials.personId)
}

router.post('/select/:entity', function(req, res) {
  let parameters = req.body
  let resultCondition = {}

  if (parameters.conditions) {
    let conditions = parameters.conditions.map(condition => {
      let res = {}
      if (condition.operator == 'equals') {
        res[condition.field] = condition.value
        return res
      }
    })

    resultCondition = {
      $and: conditions
    }
  }

  storage
    .select(req.params.entity, parameters.sort, resultCondition)
    .then(docs => {
      res.send(JSON.stringify(docs))
    })
})

router.post('/any/:entity', function(req, res) {
  storage
    .save(req.params.entity, req.body)
    .then(docs => res.send(JSON.stringify(docs)))
})

router.post('/defect/:defectId/defectAction', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let action = req.body
  action.personId = user.id

  let params = action.parameters
  delete action.parameters

  let defectActionType = await storage.getById(
    'defectActionType',
    action.defectActionTypeId
  )

  action = await storage.save('defectAction', action)

  let defect = await storage.getById('defect', req.params.defectId)
  defect.defectActionIds.push(action.id)
  defect.statusId = defectActionType.to

  if (defectActionType.id == 6) {
    defect.executorId = params.contractorMemberId
    defect.estimatedDueDate = params.estimatedDueDate
  }

  await storage.save('defect', defect)

  res.send(JSON.stringify(action))
})

router.post('/defect/:defectId/defectComment', async function(req, res) {
  let user = await getUserInfo(req)
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let comment = req.body
  comment.personId = user.id

  comment = await storage.save('defectComment', comment)

  let defect = await storage.getById('defect', req.params.defectId)
  defect.defectCommentIds.push(comment.id)

  await storage.save('defect', defect)

  res.send(JSON.stringify(comment))
})

router.post('/login', async function(req, res) {
  let payload = req.body
  let user = null

  let credentials = await storage.getByQuery('credentials', {
    login: payload.login,
    password: payload.password
  })
  if (credentials.length != 0) {
    user = await storage.getById('person', credentials[0].personId)
    user.token = credentials[0].id
  }

  res.send(JSON.stringify(user))
})

module.exports = router
