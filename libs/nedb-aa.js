const Datastore = require('nedb')



module.exports = class Collection{

  constructor(options) {
    this.datastore = new Datastore(options);
  }

  loadDatabase() {
    return new Promise( (resolve, reject ) => {
      this.datastore.loadDatabase((err) => {
        if(err) {
          reject("Open error: "+ err.message)
        } else {
          resolve("Collection opened")
        }
      })
    })
  }

  insert(doc) {
    return new Promise( (resolve, reject ) => {
      this.datastore.insert( doc, (err, newDoc) => {
        if(err) {
          reject("Insert error: "+ err.message)
        } else {
          resolve(newDoc)
        }
      })
    })
  }

  find(condition) {
    return new Promise( (resolve, reject ) => {
      this.datastore.find( condition, (err, docs) => {
        if(err) {
          reject("Find error: "+ err.message)
        } else {
          resolve(docs)
        }
      })
    })
  }

  findOne(condition) {
    return new Promise( (resolve, reject ) => {
      this.datastore.findOne( condition, (err, doc) => {
        if(err) {
          reject("Find error: "+ err.message)
        } else {
          resolve(doc)
        }
      })
    })
  }

  remove(condition, options = {}) {
    return new Promise( (resolve, reject ) => {
      this.datastore.remove( condition, options, (err, numRemoved) => {
        if(err) {
          reject("Remove error: "+ err.message)
        } else {
          resolve(numRemoved)
        }
      })
    })
  }
}


