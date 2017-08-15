module.exports = {
  networks: {
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gasPrice: 20000000000,
      gas: 1000000,
      from: '0x481b4048534290f3ee3ce5166d1a2eb1429238b2'
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
