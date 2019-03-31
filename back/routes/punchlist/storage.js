var Collection = require('../../../libs/nedb-aa')

const idGenerator = require('./id-generator')

let collections = {}

function getCollection(name) {
  if (!(name in collections)) {
    collections[name] = new Collection({
      filename: __dirname + '/store/' + name,
      autoload: true
    })
  }

  return collections[name]
}

module.exports.getAll = async function(entityName) {
  let store = getCollection(entityName)

  return store.find({})
}

module.exports.getById = async function(entityName, id) {
  let store = getCollection(entityName)

  return store.findOne({ id: parseInt(id) })
}

module.exports.getByIds = async function(entityName, ids) {
  let store = getCollection(entityName)

  if (!Array.isArray(ids)) {
    throw new TypeError(`Input variable is not an array: ${ids}`)
  }

  return store.find({ id: { $in: ids } })
}

module.exports.getByQuery = async function(entityName, query) {
  let store = getCollection(entityName)

  return store.find(query)
}

module.exports.select = async function(entityName, sort, condition) {
  let store = getCollection(entityName)

  return new Promise((resolve, reject) => {
    store
      .getCursor(condition)
      .sort(sort)
      .exec((err, docs) => {
        if (err) {
          reject('DB error: ' + err.message)
        } else {
          resolve(docs)
        }
      })
  })
}

let save = async function(entityName, entity) {
  let store = getCollection(entityName)
  if (entity.id && entity.id > 0) {
    let existingRecords = await store.find({ id: entity.id })
    if (existingRecords.length === 0) {
      return store.insert(entity)
    } else {
      return store.update({ id: entity.id }, entity)
    }
  } else {
    entity.id = await nextId(entityName)
    return store.insert(entity)
  }
}

module.exports.saveAll = async function(entityName, entities) {
  let savePromises = []

  entities.forEach(entity => savePromises.push(save(entityName, entity)))

  return await Promise.all(savePromises)
}

module.exports.update = async function(
  entityName,
  query,
  update,
  options = {}
) {
  let store = getCollection(entityName)

  return store.update(query, update, options)
}

let nextId = async function(entityName) {
  let store = getCollection(entityName)
  //
  // let cursor = store.getCursor().sort({id: -1}).limit(1);
  //
  // let idPromise = new Promise ( (resolve, reject) => {
  //   cursor.exec( (err, docs) => {
  //     if(err) {
  //       reject("DB error: "+ err.message)
  //     } else {
  //       resolve(docs[0].id + 1)
  //     }
  //   })
  // })

  return idGenerator.getId(store)
}

module.exports.nextId = nextId
module.exports.save = save
