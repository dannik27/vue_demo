var Collection = require('../../../libs/nedb-aa')

module.exports.getAll = async function(entityName){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.find({});
};

module.exports.getById = async function(entityName, id){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.findOne({id: parseInt(id)});
};

module.exports.getByIds = async function(entityName, ids){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.find({ id: { $in: ids }});
};

module.exports.getByQuery = async function(entityName, query){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.find(query);
};

module.exports.save = async function(entityName, entity){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  let existingRecord = await store.find({id: entity.id});

  if(existingRecord == null){
    return store.insert(entity);
  } else {
    return store.update({id: entity.id}, entity);
  }

};

module.exports.saveAll = async function(entityName, entities){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.insert(entities);

};

module.exports.update = async function(entityName, query, update, options = {}){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.update(query, update, options);
};

module.exports.nextId = async function(entityName){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  let cursor = store.getCursor().sort({id: -1}).limit(1);

  return new Promise ( (resolve, reject) => {
    cursor.exec( (err, docs) => {
      if(err) {
        reject("DB error: "+ err.message)
      } else {
        resolve(docs[0].id + 1)
      }
    })
  })


};
