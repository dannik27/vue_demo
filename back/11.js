const fs = require('fs');
var iconv = require('iconv-lite');
var request = require('request-promise');
var cheerio = require('cheerio');

var mapper = require('./food-mapper');

var pretty = function(json){
  return JSON.stringify(json, null, 2);
};

var saveToFile = function(content, filepath) {
  fs.writeFile(filepath, content, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log(`The file ${filepath} was created!`);
  });
};



var saveFoodPages = function() {

  var pages = JSON.parse(fs.readFileSync('foods_backup', 'utf8'));



  for (let i = 0; i < pages.length; i++) {
    pages[i].id = i;
  }

  saveToFile(pretty(pages), './foods_backup');


};

var rateFood = function() {

  var pages = JSON.parse(fs.readFileSync('foods_backup', 'utf8'));


  let result = pages
      .map(mapper.mapToCategories)
      .map(mapper.mapToRating);


  saveToFile(pretty(result), './foods_backup4');

}


rateFood();
