var JSONPath = require('JSONPath');
var curl = require('curl');
const fs = require('fs');
var iconv = require('iconv-lite');
var request = require('request-promise');
var cheerio = require('cheerio');

var pretty = function(json){
  return JSON.stringify(json, null, 2);
};

var print = function(value) {
  console.log(pretty(value));
};

var saveToFile = function(content, filepath) {
  fs.writeFile(filepath, content, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log(`The file ${filepath} was created!`);
  });
};

var isPageExists = function(html) {
  var $ = cheerio.load(html);
  return $('#pagetitle').text();
}

var parsePbprog = function(html) {

  if(! isPageExists(html)){
    return;
  }

  var $ = cheerio.load(html, {decodeEntities: false});

  let product = $('#pagetitle').text();
  let category = $('table.data-table').next().next().children().eq(0).text();

  let result = {
    product: product,
    category: category,
    components: []
  };

  $('table.data-table > tbody > tr').slice(1).each((i, item) => {

    let nameCol = $(item).children().eq(0).text();
    let valCol = $(item).children().eq(1).text();

    let name = nameCol.split(', ')[0];
    let unit = nameCol.split(', ')[1];

    result.components.push({
      name: name,
      unit: unit,
      count: valCol
    });

  });

  return result;
};


var start = async function() {

  let result = [];

  for(let i = 1; i< 2870; i++){

    var opt = {
      uri: `http://pbprog.ru/databases/foodmeals/12000/${i}.php`,
      encoding: null
    };

    console.log(i)

    var response = await request(opt);

    var parsed = parsePbprog(iconv.decode(response, 'windows-1251').replace(/\s+/g,' ').trim());

    result.push(parsed);


  }

  console.log(pretty(result))

  saveToFile(pretty(result), './result');

  // let i = 1;

  // while (true) {
  //
  //   let ok = visit(`http://pbprog.ru/databases/foodmeals/12000/${i}.php`);
  //   i+=1;
  //   if(! ok) {
  //     break;
  //   }
  // }

};



// var pbprog_result = [
//   {
//     name: 'sdad',
//     N: 0.12
//   },
//   {
//     name: 'qwe',
//     N: 0.05
//   },
// ];
// var filter = '$[*].name';
//
//
// JSONPath({json: pbprog_result, path: filter, callback: print});
//
// var opt = {
//   url: 'http://pbprog.ru/databases/foodmeals/12000/829.php',
//   encoding: null
// };
//
// request(opt, function (err, res, body) {
//
//   parsePbprog(iconv.decode(body, 'windows-1251').replace(/\s+/g,' ').trim());
//
// });

