var express = require('express')
var router = express.Router()

let NeDBService = require('../../../shared/db/nedb-service')
let nedbService = new NeDBService(__dirname + '/store')

router.post('/select/:entity', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.select(user, req.params.entity, req.body)

  res.send(JSON.stringify(response))
})

router.post('/any/:entity', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.postAny(user, req.params.entity, req.body)

  res.send(JSON.stringify(response))
})

router.post('/login', async function(req, res) {
  let response = await nedbService.login(req.body)

  res.send(JSON.stringify(response))
})

// --------------------- FORM ----------------------------

router.post('/form/schema', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getSchemaFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/newDefect', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getNewDefectFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/defectList', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getDefectListFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/defectCard', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getDefectCardFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/componentLinkWidget', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getComponentLinkWidgetFormData(
    user,
    req.body
  )

  res.send(JSON.stringify(response))
})

router.post('/form/searchWidget', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getSearchWidgetFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/popup', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getPopupFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/home', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getHomeFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/form/report', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getReportFormData(user, req.body)

  res.send(JSON.stringify(response))
})

// ------------------------------  POST  -------------------------------

router.post('/post/defect/', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService.postDefect(user, req.body).then(response => {
    res.send(response)
  })
  // .catch(error => res.status(500).send(error))
})

router.post('/post/defectAction', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService.postDefectAction(user, req.body).then(response => {
    res.send(response)
  })
  // .catch(error => res.status(500).send(error))
})

router.post('/post/defectComment', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService.postDefectComment(user, req.body).then(response => {
    res.send(response)
  })
  // .catch(error => res.status(500).send(error))
})

router.post('/post/mark', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService.postMark(user, req.body).then(response => {
    res.send(response)
  })
  // .catch(error => res.status(500).send(error))
})

// ------------------------ SYNC -----------------------

router.get('/check', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  res.send('ok')
})

router.get('/synchronize', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService
    .synchronize(user, req.body)
    .then(response => {
      res.send(response)
    })
    .catch(error => res.status(500).send(error))
})

module.exports = router
