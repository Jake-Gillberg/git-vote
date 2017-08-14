var ERC20Voting = artifacts.require("./ERC20Voting.sol");
var TestERC20 = artifacts.require("./TestERC20.sol");

module.exports = function(deployer, network) {
  var tokenAddress = '0x168296bb09e24A88805CB9c33356536B980D3fC5';

  let erc20Deployed;
  if (network != "live") {
    erc20Deployed = deployer.deploy(TestERC20).then(function() {tokenAddress = TestERC20.address;});
  } else {
    erc20Deployed = Promise.resolve(undefined);
  }

  erc20Deployed.then(function() {
    return deployer.deploy(ERC20Voting, tokenAddress);
  });

};
