require('dotenv').config();

/* istanbul ignore next */
module.exports = {
  connectionConfig: { host: 'localhost', port: 28015 },
  sendingAddress: 't1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL',
  sendingAmount: 0.000001,
  sendingFee: 0.000001,
  hashes: 256,
  port: process.env.PORT || 80,
  rpcuser: process.env.rpcuser,
  rpcpass: process.env.rpcpass,
};
