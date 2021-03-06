var expect = require('chai').expect;
var utils = require('../lib/utils.js');

describe('Backend Utils', function() {

  describe('timeSince function', function() {

    // subtract hours from a Date
    Date.prototype.subtractMinutes= function(m){
      this.setMinutes(this.getMinutes()-m);
      return this;
    };

    it('check timeSince function', function() {
      let currentTime = new Date();

      // current time
      expect(utils.timeSince(currentTime)).to.equal('0 seconds ago');

      // subtract 10 minutes
      currentTime.subtractMinutes(10);
      expect(utils.timeSince(currentTime)).to.equal('10 minutes ago');

      // subtract 2 hours
      currentTime.subtractMinutes(120);
      expect(utils.timeSince(currentTime)).to.equal('2 hours ago');

      // subtract 2 days
      currentTime.subtractMinutes(2880);
      expect(utils.timeSince(currentTime)).to.equal('2 days ago');

    });

  });

  describe('isAddress function', function() {
      it('valid taddress', function () {
        let validAddress = 't1KjU2TUgNuWmbyEmYh19AJL5niF5XdUsoa';
        expect(utils.isAddress(validAddress)).to.equal(true);
      });
      it('invalid taddress', function () {
        expect(utils.isAddress('notvalidaddress')).to.equal(false);
      });
      it('wrong length', function () {
        expect(utils.isAddress('t1Zo4ZtTpu7tvdXvZRBZvC')).to.equal(false);
      });
      it('changed address', function () {
        let changedAddress = 't1KjU2TUgNuWmbyEmYh19zJL5iiF5XdUsoa';
        expect(utils.isAddress(changedAddress)).to.equal(false);
      });
      it('bitcoin address', function () {
        let bitcoinAddress = '1mayif3H2JDC62S4N3rLNtBNRAiUUP99k';
        expect(utils.isAddress(bitcoinAddress)).to.equal(false);
      });

  });

});
