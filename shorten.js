const crypto = require('crypto');

//Returns the hash corresponding to a URL.
function getUrlHash(url) {
  return crypto.createHash('sha512')
               .update(url)
               .digest('hex');
}

//Squeezes a hash to a shorter length (cryptographic sponge).
function squeeze(hash) {
  return crypto.createCipher('aes192', 'shawty is a melody')
               .update(hash, 'utf8', 'hex')
               .slice(0, 8);
}

module.exports = function shorten(url) {
  const shortenKey = squeeze(getUrlHash(url));
  return `${shortenKey}`;
};
