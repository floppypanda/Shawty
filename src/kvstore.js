const level = require('level');

let db = null;

//Initializing key-value store.
function init(databaseDir) {
  db = level(databaseDir);
}

//Retrieves the URL corresponding to a shorten key.
function getOriginalUrl(shortenKey, cb) {
  db.get(shortenKey, function (err, value) {
    return (err) ? cb(err, null) : cb(null, value);
  });
}

//Inserted a shorten key and original URL into key-value store.
function putUrlPair(shortenKey, originalUrl, cb) {
  db.put(shortenKey, originalUrl, function (err) {
    return (err) ? cb(err) : cb();
  });
}

//Removes a key-value
function deleteUrl(shortenKey, cb) {
  db.del(shortenKey, function (err) {
    return (err) ? cb(err) : cb();
  });
}

module.exports = {
  init,
  getOriginalUrl,
  putUrlPair,
  deleteUrl,
};
