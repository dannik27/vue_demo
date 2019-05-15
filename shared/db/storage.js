var Collection = require('../../libs/nedb-aa')
const idGenerator = require('./id-generator')

module.exports = class Storage {
  constructor(foldername) {
    this.foldername = foldername
    this.collections = {}
  }

  _getCollection(name) {
    if (!(name in this.collections)) {
      this.collections[name] = new Collection({
        filename: this.foldername + '/' + name,
        autoload: true
      })
    }

    return this.collections[name]
  }

  async getAll(entityName) {
    let store = this._getCollection(entityName)

    return store.find({})
  }

  async getById(entityName, id) {
    let store = this._getCollection(entityName)
    return store.findOne({ id: parseInt(id) })
  }

  async getByIds(entityName, ids) {
    let store = this._getCollection(entityName)

    if (!Array.isArray(ids)) {
      throw new TypeError(`Input variable is not an array: ${ids}`)
    }

    return store.find({ id: { $in: ids } })
  }

  async getByQuery(entityName, query) {
    let store = this._getCollection(entityName)

    return store.find(query)
  }

  async select(entityName, sort, condition) {
    let store = this._getCollection(entityName)

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

  async save(entityName, entity) {
    let store = this._getCollection(entityName)
    if (entity.id && entity.id > 0) {
      let existingRecords = await store.find({ id: entity.id })
      if (existingRecords.length === 0) {
        return store.insert(entity)
      } else {
        return store.update({ id: entity.id }, entity)
      }
    } else {
      entity.id = await this._nextId(entityName)
      return store.insert(entity)
    }
  }

  async saveAll(entityName, entities) {
    let savePromises = []

    entities.forEach(entity => savePromises.push(this.save(entityName, entity)))

    return await Promise.all(savePromises)
  }

  async update(entityName, query, update, options = {}) {
    let store = this._getCollection(entityName)

    return store.update(query, update, options)
  }

  async _nextId(entityName) {
    let store = this._getCollection(entityName)
    return idGenerator.getId(store)
  }
}
