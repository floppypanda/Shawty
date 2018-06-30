const level = require('level');

let db = null;

//Initializing key-value store.
function init(databaseDir) {
  db = level(databaseDir);
}

//Retrieves the URL corresponding to a shorten key.
function getOriginalUrl(shortenKey, cb) {
  db.get(shortenKey, function (err, value) {
    if (err) {
      return cb(err, null);
    } else {
      return cb(null, value);
    }
  });
}

//Inserted a shorten key and original URL into key-value store.
function putUrlPair(shortenKey, originalUrl, cb) {
  db.put(shortenKey, originalUrl, function (err) {
    if (err) {
      return cb(err);
    } else {
      cb();
    }
  });
}

//Removes a key-value
function deleteUrl(shortenKey, cb) {
  //TODO - Implement.
  cb();
}

module.exports = {
  init,
  getOriginalUrl,
  putUrlPair,
  deleteUrl,
};
