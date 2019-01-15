
exports.mapToNames = function(record) {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    energy: record['Energy'],
    protein: record['Protein'],
    fat: record['Fatty acids, total saturated'],
    sugars: record['Sugars, total'],
    sodium: record['Sodium, Na'],
    fibre: record['Fiber, total dietary']
  }
}

exports.mapToCategories = function(record) {
  let categoryIndex = 'NONE';

  if (record.category == 'Dairy and Egg Products') {
    categoryIndex = '2D';
  }

  if (record.category == 'Fats and Oils') {
    categoryIndex = '3';
  }

  if (record.category == 'Fruits and Fruit Juices' ||
      record.category =='Beverages') {
    categoryIndex = '1';
  }

  if (categoryIndex == 'NONE') {
    categoryIndex = '2';
  }

  record.categoryIndex = categoryIndex;

  return record;
}

exports.mapToRating = function(record) {


  let energyPoints = [0, 334,670,1005,1340,1675,2010,2345,2680,3015,3350,3685];
  let fatPoints = [0,1,2,3,4,5,6,7,8,9,10,11.2,12.5,13.9,15.5];
  let sugarPoints = [0,5,9,13,18,22,27,31,36,40,45,49,54,58,63];
  let sodiumPoints = [0,90,180,270,360,450,540,630,720,810,900,1005,1121,1251,1397];
  let proteinPoints = [0,1.6,3.2,4.8,6.4,8.0,9.6,11.6,13.9,16.7,20,24,28.9,34.7,41.6,50];
  let fibrePoints = [0,0.9,1.9,2.8,3.7,4.7,5.4,6.3,7.3,8.4,9.7,11.2,13.0,15,17.3,20];

  let stars = [5,4.5,4,3.5,3,2.5,2,1.5,1,0.5];
  let score = {
    '1': [-100,-5,-4,-3,-2,-1,0,1,2,3],
    '1D': [-100,-1,0,1,2,3,4,5,6,7],
    '2': [-100,-7,-2,2,6,11,15,20,24,28],
    '2D': [-100,-1,0,1,2,3,4,5,6,7],
    '3': [-100,16,20,23,27,30,34,37,41,45],
    '3D': [-100,22,24,26,28,30,32,34,36,38]
  };

  let energyScore = findIndexInArray(energyPoints, record.energy);
  let fatScore = findIndexInArray(fatPoints, record.fat);
  let sugarScore = findIndexInArray(sugarPoints, record.sugar);
  let sodiumScore = findIndexInArray(sodiumPoints, record.sodium);
  let proteinScore = 0;
  let fibreScore = 0;

  let baselineScore = energyScore + fatScore + sugarScore + sodiumScore;

  if (baselineScore >= 13) {
    proteinScore = findIndexInArray(proteinPoints, record.protein);
  }

  if (record.categoryIndex != '1' && record.categoryIndex != '1D') {
    fibreScore = findIndexInArray(fibrePoints, record.fibre);
  }

  let finalScore = baselineScore - proteinScore - fibreScore;


  let starIndex = findIndexInArray(score[record.categoryIndex], finalScore);

  let rating = stars[starIndex];

  record.rating = rating;

  return record;
}

function findIndexInArray(array, value) {

  let index = -1;

  array.forEach((arrayValue, arrayIndex) =>{
    if (value > arrayValue) {
      if( arrayIndex > index) {
        index = arrayIndex;
      }
    }
  });

  return index;
}