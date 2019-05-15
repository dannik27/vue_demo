var express = require('express')
var router = express.Router()

let NeDBService = require('../../../shared/db/nedb-service')
let nedbService = new NeDBService(__dirname + '/store')

router.post('/schema', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getSchemaFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/newDefect', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getNewDefectFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/defectList', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getDefectListFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/defectCard', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getDefectCardFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/componentLinkWidget', async function(req, res) {
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

router.post('/searchWidget', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getSearchWidgetFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/popup', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getPopupFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/home', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getHomeFormData(user, req.body)

  res.send(JSON.stringify(response))
})

router.post('/report', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  let response = await nedbService.getReportFormData(user, req.body)

  res.send(JSON.stringify(response))
})

// ------------------------------  POST  -------------------------------

router.post('/createDefect/', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService.postDefect(user, req.body).then(response => {
    res.send(response)
  })
  // .catch(error => res.status(500).send(error))
})

router.post('/createDefectAction', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService
    .postDefectAction(user, req.body)
    .then(response => {
      res.send(response)
    })
    .catch(error => res.status(500).send(error))
})

router.post('/createDefectComment', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService
    .postDefectComment(user, req.body)
    .then(response => {
      res.send(response)
    })
    .catch(error => res.status(500).send(error))
})

router.post('/createMark', async function(req, res) {
  let user = await nedbService.getUserInfo(req.get('Authorization'))
  if (!user) {
    res.status(401).send('Unauthorized')
  }

  nedbService
    .postMark(user, req.body)
    .then(response => {
      res.send(response)
    })
    .catch(error => res.status(500).send(error))
})

module.exports = router
