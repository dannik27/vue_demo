let queue = []

// let job = {
//   collection,
//   resolve,
//   reject,
// }

let cache = {}

let running = false

function start() {
  if (!running) {
    running = true
    runNext()
  }
}

function getId(collection) {
  let promise = new Promise((resolve, reject) => {
    queue.push({ collection, resolve, reject })
  })
  start()
  return promise
}

function runNext() {
  if (queue.length > 0) {
    let job = queue.pop()
    let oldId = cache[job.collection.id]
    if (oldId) {
      let newId = oldId + 1
      cache[job.collection.id] = newId
      job.resolve(newId)
      runNext()
      return
    }

    let cursor = job.collection
      .getCursor()
      .sort({ id: -1 })
      .limit(1)

    cursor.exec((err, docs) => {
      if (err) {
        job.reject('DB error: ' + err.message)
      } else {
        let newId = docs[0].id + 1
        cache[job.collection.id] = newId
        job.resolve(newId)
      }
      runNext()
    })
  } else {
    running = false
  }
}

module.exports.getId = getId
