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


const SITE_BASE_URL = 'https://health-diet.ru';

var saveFoodPages = async function() {

  let menuPage = await request(SITE_BASE_URL + '/table_calorie/');

  var $ = cheerio.load(menuPage);

  let categoryPages = [];

  $('div.el-calorie-items').children().each((i, el) => {
    categoryPages.push({
      category: el.children[0].data,
      url: el.attribs.href
    });
  });

  saveToFile(pretty(categoryPages), './category_pages');

  let foodPages = [];

  for(const page of categoryPages) {
    let categoryPage = await request(SITE_BASE_URL + page.url);

    let $ = cheerio.load(categoryPage);

    $('table.uk-table').find('a').each((i, el) => {
      foodPages.push({
        category: page.category,
        url: el.attribs.href
      });
    });
  }

  saveToFile(pretty(foodPages), './food_pages');


};

function extractValueFromTable(table, nutrient) {
  let value = table.find(`td:contains("${nutrient}")`).first().next().text();
  if (value == '') {
    return 0;
  } else {
    return parseFloat(value.substr(0,value.indexOf(' ')));
  }
}

function extractDescription(descriptionBlock) {

  let text = descriptionBlock.text();

  return text.substr(0,text.indexOf('Чем полезен')).replace(/\s+/g,' ').trim();
}

var visitFoodPages = async function() {

  let foods = [];

  var pages = JSON.parse(fs.readFileSync('food_pages', 'utf8'));

  for(const [i, page] of pages.entries()) {
    let foodPage = await request(SITE_BASE_URL + page.url);

    let $ = cheerio.load(foodPage);
    let table = $('table.mzr-tc-chemical-table');

    let descriptionBlock = $('div.mzr-block-header:contains("ПОЛЕЗНЫЕ СВОЙСТВА")').first().next();


    let fat = 0; extractValueFromTable(table, 'Насыщеные жирные кислоты');
    if (fat == 0) fat = (extractValueFromTable(table, 'Жиры') * 0.8).toFixed(2)

    let item = {
      name: descriptionBlock.find('b').first().text(),
      description: extractDescription(descriptionBlock),
      category: page.category,
      energy: extractValueFromTable(table, 'Калорийность'),
      protein: extractValueFromTable(table, 'Белки'),
      fat: fat,
      sugars: extractValueFromTable(table, 'дисахариды'),
      sodium: extractValueFromTable(table, 'Натрий'),
      fibre: extractValueFromTable(table, 'волокна'),
    }

    foods.push(item);

    console.log(i)

  }

  saveToFile(pretty(foods), './foods');

}

visitFoodPages();



