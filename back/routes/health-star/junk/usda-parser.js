const fs = require('fs');
var sqlite = require('../../../../libs/sqlite-aa');
var mapper = require('./food-mapper');
var translate = require('./translate')


async function getDataFromDb() {

  sqlite.open('usda.sql3')

  let query = "select f.id, f.long_desc name, n.name nutrient, fg.name category, main.amount, n.units from nutrition main\n" +
      "\tleft join nutrient n on n.id = main.nutrient_id\n" +
      "\tleft join food f on f.id = main.food_id\n" +
      "\tleft join food_group fg on f.food_group_id = fg.id\n" +
      "\twhere (n.tagname = 'FASAT' or n.tagname = 'SUGAR' or n.tagname = 'ENERC_KCAL' or" +
      " n.tagname = 'NA' or n.tagname = 'FIBTG' or n.tagname = 'PROCNT');";

  let foods = [];
  let currentFood = { id: 0};

  await sqlite.each(query, [], (row) => {

    if(row.id == currentFood.id) {
      currentFood[row.nutrient] = row.amount;
    } else {
      if (currentFood.id != 0) {
        foods.push(currentFood);
      }
      currentFood = { id: row.id, name: row.name, category: row.category }
      currentFood[row.nutrient] = row.amount;
    }

  });

  return foods;
}

function saveData(){
  getDataFromDb()
      .then(data => {

        let result = data.map(mapper.mapToNames)
            .map(mapper.mapToCategories)
            .map(mapper.mapToRating);

        saveToFile(pretty(result), 'usda.json')
      });
}


var saveToFile = function(content, filepath) {
  fs.writeFile(filepath, content, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log(`The file ${filepath} was created!`);
  });
};

var pretty = function(json){
  return JSON.stringify(json, null, 2);
};

var translateNames = async function() {

  sqlite.open('usda.sql3')

  let query = "select id, long_desc from food";

  let food = [];

  let r = await sqlite.all(query, []);

  for(const [i, row] of r.entries()){
    food.push({
      id: row.id,
      eng: row.long_desc,
      rus: await translate.translate(row.long_desc)
    });
    console.log(i);
  }


  saveToFile(pretty(food), 'gtt');

}

translateNames()
    .then(console.log('ok'))
    .catch(err => console.log(err))
