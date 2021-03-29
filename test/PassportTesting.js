const { assert } = require("chai");

var Passport = artifacts.require("./Passport.sol");

contract("Passport", function (accounts) {
  var passportInstance;

  it("contract deployed with an administrator address", function () {
    return Passport.deployed()
      .then(function (instance) {
        return instance.administrator();
      })
      .then(function (administratorAddress) {
        var expectedAdminAddress = 0x769ae6c73ec565ac8590261cf9009c38a9756929;
        assert.equal(expectedAdminAddress, administratorAddress);
      });
  });

  it("verified user added succesfully", function () {
    let address = "0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return instance.isVerified(address);
      })
      .then(function (verifiedStatus) {
        assert.isFalse(verifiedStatus);
        passportInstance
          .addVerifiedUser(address)
          .then(function (addVerified) {
            return passportInstance.addVerifiedUser(address);
          })
          .then(function (changeStatus) {
            return passportInstance.isVerified(address);
          })
          .then(function (newVerifiedStauts) {
            assert.isTrue(newVerifiedStauts);
          });
      });
  });

  it("verified user removed succesfully", function () {
    let address = "0x79e7264b03064d7CEB764f407D7a607Cb1b3397e";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return instance.isVerified(address);
      })
      .then(function (verifiedStatus) {
        assert.isFalse(verifiedStatus);
        passportInstance
          .addVerifiedUser(address)
          .then(function (addVerified) {
            return passportInstance.addVerifiedUser(address);
          })
          .then(function (changeStatus) {
            return passportInstance.isVerified(address);
          })
          .then(function (newVerifiedStauts) {
            assert.isTrue(newVerifiedStauts);
          })
          .then(function (removeVerified) {
            return passportInstance.removeVerified(address);
          })
          .then(function (removedStatus) {
            return passportInstance.isVerified(address);
          })
          .then(function (checkVerified) {
            assert.isFalse(checkVerified);
          });
      });
  });
});
