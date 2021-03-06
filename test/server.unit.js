var app     = require('../server.js');
var db      = require('../lib/db.js');
const config  = require('../config.js');

var supertest = require('supertest');
var api = supertest('http://localhost:'+ config.port);

require('./testHelper');

describe('Server Routes', function() {

  before(function(done) {
    app.listen(config.port, done);
  });

  describe('Index Route', function() {

    it('index should return a 200 response', function(done) {
      api.get('/').expect(200, done);
    });

  });

  describe('Add Route', function() {

    it('missing inputAddress in /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 'notcorrectforminput',
              'coinhive-captcha-token': 'DS6WL3kCBmnMSPN3vsXspJEOdEIP6Era'})
       .expect(400, done);
    });

    it('no inputAddress in /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'coinhive-captcha-token': 'DS6WL3kCBmnMSPN3vsXspJEOdEIP6Era'})
       .expect(400, done);
    });

    it('sample address to /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 't1KjU2TUgNuWmbyEmYh19AJL5niF5XdUsoa',
              'coinhive-captcha-token': 'DS6WL3kCBmnMSPN3vsXspJEOdEIP6Era'})
       .expect(302, done); // 302 because we are redirecting to index route
    });

    it('invalid address to /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 'notvalidaddress',
              'coinhive-captcha-token': 'DS6WL3kCBmnMSPN3vsXspJEOdEIP6Era'})
       .expect(400, done);
    });

    it('changed address to /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 't1KjU2TUgNuWmbyXmYh19AJL5niF5EdUsoa',
              'coinhive-captcha-token': 'DS6WL3kCBmnMSPN3vsXspJEOdEIP6Era'})
       .expect(400, done);
    });

    it('empty captcha token on /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 't1KjU2TUgNuWmbyEmYh19AJL5niF5XdUsoa'})
       .expect(400, done);
    });

    it('invalid captcha token on /api/add', function(done) {
      api.post('/api/add')
       .set("Content-Type", "application/json")
       .type("form")
       .send({'inputAddress': 't1KjU2TUgNuWmbyXmYh19AJL5niF5EdUsoa',
              'coinhive-captcha-token': 'invalidcaptcha'})
       .expect(400, done);
    });

  });

});
