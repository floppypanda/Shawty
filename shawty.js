const bodyparser = require('body-parser');
const express = require('express');
const nib = require('nib');
const os = require('os');
const path = require('path');
const stylus = require('stylus');

const kvstore = require('./src/kvstore');
const shorten = require('./src/shorten');

const app = express();
const port = 8000; //TODO - Make port configurable.

//Using Pug templates for generating HTML.
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

//Using Stylus files for generating CSS.
const stylusDir = path.join(__dirname, 'stylus');
const stylesheetDir = path.join(__dirname, 'public/stylesheets');
app.use(express.static(stylesheetDir));
app.use(stylus.middleware({
  src : stylusDir,
  dest : stylesheetDir,
  compile : function (str, path) {
    return stylus(str).set('filename', path).use(nib());
  }
}));

app.use(bodyparser.urlencoded({ extended : false }));

//Initializing key-value store.
kvstore.init(path.join(__dirname, 'db'));

//Defining routes.
app.get('/', function (req, res) {
  return res.render('home');
});
app.param('shawtyKey', function (req, res, next, shawtyKey) {
  req.shawtyKey = shawtyKey;
  return next();
});
app.get('/:shawtyKey', function (req, res) {
  kvstore.getOriginalUrl(req.shawtyKey, function (err, redirectUrl) {
    if (err) {
      console.error(err);
      //TODO - Redirect to an error page instead of home page.
      return res.redirect('/');
    } else {
      return res.redirect(redirectUrl);
    }
  });
});
app.post('/shorten', function (req, res) {
  const inputUrl = req.body.url;
  //TODO - Conduct further validation on URL before passing it through.
  if (inputUrl) {
    const shortenKey = shorten(inputUrl);
    //TODO - Grab the actual domain of the server regardless of where it is run.
    const shortUrl = `http://localhost:${port}/${shortenKey}`;
    kvstore.putUrlPair(shortenKey, inputUrl, function (err) {
      if (err) {
        return res.send(500);
      } else {
        return res.render('shortened', { input_url : inputUrl,
                                         input_url_len : inputUrl.length,
                                         short_url : shortUrl,
                                         short_url_len : shortUrl.length });
      }
    });
  } else {
    //TODO - Display message indicating that a URL must be submitted.
    return res.redirect('/');
  }
});
//TODO - Change the server to use HTTPS.
app.listen(8000);
