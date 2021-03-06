var ejs       = require('ejs');
var path      = require("path");
var express   = require('express');
var r         = require('rethinkdb');

// create app and config vars
var app       = express();
const config  = require('./config.js');

// internal libs
var db        = require('./lib/db.js');
var utils     = require('./lib/utils.js');
require('./lib/captcha.js');

// make the css folder viewable
app.use(express.static('public/css'));

var bodyParser = require('body-parser'); // create application/json parser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// set the view engine to ejs
app.set('view engine', 'ejs');

// index route
app.get('/',function(req, res){
  r.connect(config.connectionConfig, function(err, conn) {
    if(err) throw err;

    // pass drips to ejs for rendering
    db.latestDrips(conn).then(function(cursor) {
      cursor.toArray(function(err, rows) {
        // make time in rows human readable, and then send to template
        res.render('index', { drips: utils.readableTime(rows) });
      });
    });

  });
});

// add route
app.post('/api/add', function (req, res) {
  // empty input, valid zcash address, then empty captcha
  if (!req.body.inputAddress) return res.sendStatus(400);
  else if (!utils.isAddress(req.body.inputAddress)) return res.sendStatus(400);
  else if (!req.body['coinhive-captcha-token']) return res.sendStatus(400);

  // check if captcha is valid
  global.validateCaptcha(req.body['coinhive-captcha-token'])
    .then(response => {
      // check success response
      if (JSON.parse(response).success === false) return res.sendStatus(400);

      // save to db, and redirect to index
      db.createDrip(req.body.inputAddress);
      res.redirect('/'); // TODO: Figure out how to use AJAX, and remove this.
    });

});

// start the server, if running this script alone
/* istanbul ignore next */
if (require.main === module) {
  app.listen(config.port, function() {
    console.log('Server started! At http://localhost:' + config.port);
  });
}

module.exports = app;
