App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Passport.json", function (data) {
      var PassportArtifact = data;
      App.contracts.Passport = TruffleContract(PassportArtifact);

      App.contracts.Passport.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function () {
    var passportInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err == null) {
        console.log(account);
        App.account = account;
        $("#accountAddress").html("Your account: " + account);
      }

      App.contracts.Passport.deployed()
        .then(function (instance) {
          passportInstance = instance;
          return passportInstance.administrator();
        })
        .then(function (administrator) {
          var adminAddress = $("#administratorAddress");
          adminAddress.append(administrator);
        });

      loader.hide();
      content.show();
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
