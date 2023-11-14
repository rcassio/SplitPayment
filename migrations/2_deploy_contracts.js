const SplitPayment = artifacts.require("SplitPayment");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SplitPayment, accounts[0]);
};