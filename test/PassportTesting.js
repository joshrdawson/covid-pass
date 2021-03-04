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
    return Passport.deployed()
      .then(function (instance) {
        passportInstance = instance;
        return instance.isVerified("0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6");
      })
      .then(function (verifiedStatus) {
        assert.isFalse(verifiedStatus);
        passportInstance
          .addVerifiedUser("0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6")
          .then(function (addVerified) {
            return passportInstance.addVerifiedUser("0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6");
          })
          .then(function (changeStatus) {
            return passportInstance.isVerified("0xFDEFF5a015b517fdd67e2A00FadD138De3bA6Cf6");
          })
          .then(function (newVerifiedStauts) {
            assert.isTrue(newVerifiedStauts);
          });
      });
  });
});
