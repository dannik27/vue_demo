var express = require('express');
var router = express.Router();

var Fuse = require('fuse.js/src');

var dataFromSite = require('./pbprog_result2');
var dataFromUsda = require('./usda');
var dataFromMzr = require('./mzr');

var fuse = null;

function init() {
  let fuseOptions = {
    threshold: 0.3,
    shouldSort: true,
    includeScore: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
      "name"
    ]
  };

  fuse = new Fuse(getData(), fuseOptions);
}

function getData() {

  return getDataMzr();
}

function getDataSite() {

  let id = 1;

  return dataFromSite.slice().map(item =>{
    item.id = id;
    id += 1;
    return item;
  })
}

function getDataUsda() {

  return dataFromUsda.slice();
}

function getDataMzr() {

  return dataFromMzr.slice();
}

router.get('/', function (req, res) {

  let response = getData();

  if (req.query.name) {
    response = response.filter(item => item.name.toUpperCase().includes(req.query.name.toUpperCase()));
  }

  if (req.query.fuse) {
    response = fuse.search(req.query.fuse).map(record =>{
      record.item.fuseScore = record.score;
      return record.item

    })
  }

  if(req.query.limit) {
    response = response.slice(0, parseInt(req.query.limit));
  }

  if(req.query.sort) {
    response = response.sort((a,b) => {
      return a[req.query.sort] > b[req.query.sort] ? -1 : 1; // по убыванию
    })
  }

  res.send(response);
});

router.get('/:id', function (req, res) {

  res.send(getData().find(item => item.id == req.params.id));

});

init();


module.exports = router;