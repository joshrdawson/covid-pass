// eslint-disable-next-line no-undef
const Passport = artifacts.require("Passport.sol");

module.exports = function (deployer) {
  deployer.deploy(Passport);
};
