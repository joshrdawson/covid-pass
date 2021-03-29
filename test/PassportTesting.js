const { assert } = require("chai");

var Passport = artifacts.require("./Passport.sol");

contract("Passport", function (accounts) {
  var passportInstance;

  it("contract deployed with an administrator address", function () {
    return Passport.deployed()
      .then(function (instance) {
        return instance.administrator(); // get the admin address
      })
      .then(function (administratorAddress) {
        var expectedAdminAddress = 0x769ae6c73ec565ac8590261cf9009c38a9756929; // the admin address of the test network (the address which deploys the contract)
        assert.equal(expectedAdminAddress, administratorAddress); // check the real admin address is the same as the expected one
      });
  });

  it("verified user added succesfully", function () {
    let address = "0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return passportInstance.isVerified(address); // check if the address is currently verified
      })
      .then(function (verifiedStatus) {
        assert.isFalse(verifiedStatus); // since the address hasnt been verified yet, it should not be verified
      })
      .then(function () {
        return passportInstance.addVerifiedUser(address); // add the address to the verified list
      })
      .then(function () {
        return passportInstance.isVerified(address); // check if it is now verified
      })
      .then(function (newVerifiedStatus) {
        assert.isTrue(newVerifiedStatus);
      });
  });

  it("verified user removed succesfully", function () {
    let address = "0x79e7264b03064d7CEB764f407D7a607Cb1b3397e";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return passportInstance.isVerified(address);
      })
      .then(function (verifiedStatus) {
        assert.isFalse(verifiedStatus); // the address shouldnt be verified yet (it hasnt been verified)
      })
      .then(function () {
        return passportInstance.addVerifiedUser(address); // add the address as verified
      })
      .then(function () {
        return passportInstance.isVerified(address);
      })
      .then(function (newVerifiedStauts) {
        assert.isTrue(newVerifiedStauts); // check if the address is now verified
      })
      .then(function () {
        return passportInstance.removeVerifiedUser(address); // remove the address as a verified address
      })
      .then(function () {
        return passportInstance.isVerified(address);
      })
      .then(function (checkVerified) {
        assert.isFalse(checkVerified); // now check if it is no longer verified
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
        return passportInstance.passports(hash); // get the data of the citizen from the ledger
      })
      .then(function (citizenData) {
        assert.equal(postcode, citizenData.postcode); // check the citizen data is correct
        assert.equal(age, citizenData.age);
      });
  });

  it("removed citizen successfully", function () {
    let postcode = "NE3 1LP";
    let age = 50;
    let hash = "0xee1f19580cd612c0b9722ead7f7adc0534e982613c7a78816c3aa451997c3983"; // precalculated hash
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return passportInstance.addCitizen(hash, postcode, age); // add an imaginary citizen to the ledger
      })
      .then(function () {
        return passportInstance.passports(hash);
      })
      .then(function (citizenData) {
        assert.equal(postcode, citizenData.postcode); // check the citizen was succsesfully added
        assert.equal(age, citizenData.age);
      })
      .then(function () {
        return passportInstance.removeCitizen(hash); // remove citizen
      })
      .then(function (checkRemovedData) {
        assert.equal(undefined, checkRemovedData.postcode); // check citizen data now is undefinied rather than holding the appropriate values
        assert.equal(undefined, checkRemovedData.age);
      });
  });

  it("checked vaccination status successfully", function () {
    let hash = "0x391ac66f4928e250a510eef8deacb77087475a001c0ce1238483b87615a4ed23";
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return passportInstance.addCitizen(hash, "NE4 1LP", 35); // add a random user to the ledger (when adding a user their status is set to true)
      })
      .then(function () {
        return passportInstance.isVaccinated(hash);
      })
      .then(function (vaccinationStatus) {
        assert.isTrue(vaccinationStatus); // check their vaccination status is true
      });
  });
});
