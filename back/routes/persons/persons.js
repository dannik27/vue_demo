var express = require('express');
var router = express.Router();


var persons = [
  {
    id: 1,
    name: "Vasya",
    age: 21
  },
  {
    id: 2,
    name: "Petya",
    age: 43
  },
  {
    id: 3,
    name: "Misha",
    age: 14
  }

];

var lastId = 3;

router.get('', function (req, res) {
  res.send(JSON.stringify(persons));
});

router.post('', function(req, res) {
  lastId += 1;
  req.body.id = lastId;
  persons.push(req.body);
  res.send("OK")
});

module.exports = router;