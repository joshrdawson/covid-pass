module.exports = {
  compilers: {
    solc: {
      version: "0.7.4", 
      parser: "solcjs",
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    }
  }

}
