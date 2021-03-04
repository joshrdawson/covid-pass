var Passport = artifacts.require("./Passport.sol");

contract("Passport", function (accounts) {
    
    it("contract deployed with an administrator address", function () {
        return Passport.deployed().then(function (instance) {
            return instance.administrator();
        }).then(function (administratorAddress) {
            var expectedAdminAddress = 0x769ae6c73EC565Ac8590261cF9009C38a9756929;
            assert.equal(expectedAdminAddress, administratorAddress);
        });
    });
});