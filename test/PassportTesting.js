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
          .then(function () {
            return passportInstance.addVerifiedUser(address);
          })
          .then(function () {
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
          .then(function () {
            return passportInstance.addVerifiedUser(address);
          })
          .then(function () {
            return passportInstance.isVerified(address);
          })
          .then(function (newVerifiedStauts) {
            assert.isTrue(newVerifiedStauts);
          })
          .then(function () {
            return passportInstance.removeVerifiedUser(address);
          })
          .then(function () {
            return passportInstance.isVerified(address);
          })
          .then(function (checkVerified) {
            assert.isFalse(checkVerified);
          });
      });
  });

  it("added citizen successfully", function () {
    let postcode = "NE1 4LP";
    let age = 21;
    let hash = "0x500bba56604d0dc300a086e4af375a88def60677f6c026e6ce995e528086177d"; // precalcualted hash (front end would calculate this itself)
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return passportInstance.addCitizen(hash, postcode, age); // add the citizen
      })
      .then(function () {
        return passportInstance.passports(hash);
      })
      .then(function (citizenData) {
        assert.equal(postcode, citizenData.postcode);
        assert.equal(age, citizenData.age);
      });
  });

  it("removed citizen successfully", function () {
    let postcode = "NE3 1LP";
    let age = 50;
    let hash = "0xee1f19580cd612c0b9722ead7f7adc0534e982613c7a78816c3aa451997c3983";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return instance.addCitizen(hash, postcode, age); // add an imaginary user to the ledger
      })
      .then(function () {
        return passportInstance.passports(hash);
      })
      .then(function (citizenData) {
        assert.equal(postcode, citizenData.postcode);
        assert.equal(age, citizenData.age);
      })
      .then(function () {
        return passportInstance.removeCitizen(hash);
      })
      .then(function (checkRemovedData) {
        assert.equal(undefined, checkRemovedData.postcode);
        assert.equal(undefined, checkRemovedData.age);
      });
  });
});
