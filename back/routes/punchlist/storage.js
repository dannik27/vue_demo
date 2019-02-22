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

module.exports.save = async function(entityName, entities){

  let store = new Collection({ filename: __dirname + '/store/' + entityName, autoload: true});

  return store.insert(entities);
};

