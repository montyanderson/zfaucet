const sinon = require("sinon");
const chai = require("chai");
var r      = require('rethinkdb');

chai.use(require("chai-as-promised"));

const rpc = require("../lib/rpc.js");
var sending = require('../sending.js');
var config = require('../config.js');
var db = require('../lib/db.js');

describe('Sending Script', function() {

  const inputs = [
    {
      "txid": "8f0a16f24fb8493f22f37ef960ca14cc6c9c3c02f5d2531739776bf5b4888d65",
      "vout": 1,
      "generated": false,
      "address": "t1atPPxpdgpzC7TUNtZLMq7KCUieEYuJKkn",
      "scriptPubKey": "76a914baa0073177890860e854780b0db792333f79df1388ac",
      "amount": 0.00196000,
      "confirmations": 530,
      "spendable": true
    },
    {
      "txid": "80e2185b6b12b77dbc11bf6105b7cb801d3e44eb65fed6858a592f2781a5afb6",
      "vout": 1,
      "generated": false,
      "address": "t1R5WEPSsvHowVUAtbQFo4bAFVgaAfh9ySX",
      "scriptPubKey": "76a914baa0073177890860e854780b0db792333f79df1388ac",
      "amount": 0.00197900,
      "confirmations": 580,
      "spendable": true
    }
  ];

  const ops = [
    {
      "id": "opid-65f531ba-3fde-4b78-a8e0-bdad702627e4",
      "status": "success",
      "creation_time": 1519778150,
      "result": {
        "txid": "28c9461ccd74a3f9ac6dc54a7a4fe9806ab1b5af2ebf5f40b647c8ef86c1c326"
      },
      "execution_secs": 0.0105095,
      "method": "z_sendmany",
      "params": {
        "fromaddress": "t1atPPxpdgpzC7TUNtZLMq7KCUieEYuJKkn",
        "amounts": [
          {
            "amount": 0.00001,
            "address": "t1MfKGp8b9Spy7z9Lgg8BghaTAaN8Tw88k7"
          }
        ],
        "minconf": 1,
        "fee": 0.0001
      }
    }
  ];

  describe('Balance Testing', function() {

    it("error when balance is 0", async () => {
      rpc.getbalance = sinon.stub().returns(0);
      await chai.assert.isRejected(sending.findInputs());
    });

    it(`error when balance is ${config.sendingAmount}`, async () => {
      rpc.getbalance = sinon.stub().returns(config.sendingAmount);
      await chai.assert.isRejected(sending.findInputs());
    });

  });

  describe('Inputs Testing', function () {

    it("error with empty inputs", async () => {
      rpc.listunspent = sinon.stub().returns([]);
      await chai.assert.isRejected(sending.findInputs());
    });

    it("pick largest input", async () => {
      rpc.getbalance = sinon.stub().returns(1);
      rpc.listunspent = sinon.stub().returns(inputs);
      await chai.assert.eventually.equal(sending.findInputs(),
       't1R5WEPSsvHowVUAtbQFo4bAFVgaAfh9ySX');
    });

  });

  describe('Send Testing', function() {

    it("send sample drip", async () => {
      await db.createDrip('t1R5WEPSsvHowVUAtbQFo4bAFVgaAfh9ySX');

      rpc.getbalance = sinon.stub().returns(1);
      rpc.listunspent = sinon.stub().returns(inputs);
      rpc.zSendmany = sinon.stub().
        returns('opid-f746c8ac-116d-476b-8b44-bb098a354dad');

      const conn = await r.connect(config.connectionConfig);
      await chai.assert.eventually.equal(sending.
        sendDrip(conn, 't1R5WEPSsvHowVUAtbQFo4bAFVgaAfh9ySX'),
       'opid-f746c8ac-116d-476b-8b44-bb098a354dad');
    });

  });

  describe('Update Testing', function() {

    it("update sample drip", async () => {
      rpc.getbalance = sinon.stub().returns(1);
      rpc.listunspent = sinon.stub().returns(inputs);
      rpc.zGetoperationresult = sinon.stub().returns(ops);

      const conn = await r.connect(config.connectionConfig);
      await chai.assert.eventually.equal(sending.updateDrips(conn),
       conn);
    });

  });

});