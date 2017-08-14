import ERC20VotingContract from '../build/contracts/ERC20Voting.json'
import ERC20Contract from '../build/contracts/ERC20.json'

const Contract = require('truffle-contract');

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  addVoting()
} else {
  console.log('No web3? You should consider trying MetaMask!')
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function addVoting() {

  const ERC20Voting = Contract(ERC20VotingContract);
  const ERC20 = Contract(ERC20Contract);

  ERC20Voting.setProvider(web3.currentProvider);
  ERC20.setProvider(web3.currentProvider);

  function getERC20VotingInstance() {
    return ERC20Voting.deployed();
  }

  function getERC20Instance() {
    return getERC20VotingInstance().then((erc20VotingInstance) => {
      return erc20VotingInstance.token.call()
    }).then((erc20Address) => {
      return ERC20.at(erc20Address);
    });
  }

  const issues = document.querySelectorAll('li.js-issue-row');

  for (const issue of issues) {

    const table = issue.querySelector('.d-table');

    const issueLinkCol = table.querySelector('.col-9');
    issueLinkCol.classList.remove('col-9');
    issueLinkCol.classList.add('col-7');

    const issueLink = issueLinkCol.querySelector('a');
    const repoInfo = issueLink.getAttribute('href').split('/');
    const user = repoInfo[1];
    const repo = repoInfo[2];
    const issueNum = repoInfo[4];

    const colDiv = document.createElement('div');
    const innerDiv = document.createElement('div');
    const voteButton = document.createElement('button');
    const numVotes = document.createElement('p');

    colDiv.className = 'float-right col-2';
    innerDiv.className = 'float-right pt-2 pr-3 text-right no-wrap';
    voteButton.className = 'vote-btn btn btn-sm btn-with-count';
    voteButton.addEventListener('click', function() {voteButtonClick(user, repo, issueNum)});
    voteButton.appendChild(document.createTextNode('vote'));
    numVotes.className = 'social-count';
    numVotes.textContent = 'loading...';
    getVotesFor(getKey(user, repo, issueNum)).then( (r) => {
      numVotes.textContent = r.c[0];
    });

    innerDiv.appendChild(voteButton);
    innerDiv.appendChild(numVotes);
    colDiv.appendChild(innerDiv);
    table.appendChild(colDiv);

  }

  function approveERC20Withdrawl(spender, amount, account) {
    return getERC20Instance().then((erc20Instance) => {
        return erc20Instance.approve(spender, amount, {from: account});
      });
  }

  function sendVote(key, amount, account) {
    return getERC20VotingInstance()
      .then((erc20VotingInstance) => {
        return erc20VotingInstance.vote(key, amount, {from: account});
      });
  }

  function getVotesFor(key) {
    return getERC20VotingInstance()
      .then((erc20VotingInstance) => {
        return erc20VotingInstance.totalVotesFor.call(key);
      });
  }

  function getKey(user, repo, issueNum) {
    return web3.sha3(user.toString() + '/' + repo.toString() + '/' + issueNum.toString())
  }

  function getAccountsPromise() {
    return new Promise(function(resolve,reject){
      web3.eth.getAccounts(function(err,data){
        if(err != null) return reject(err);
        resolve(data);
      });
    });
  }

  function voteForIssue(user, repo, issueNum, amount) {
    var account;

    return getAccountsPromise().then((accounts) => {
      account = accounts[0];
      return getERC20VotingInstance()
    }).then((votingInstance) => {
      return approveERC20Withdrawl(votingInstance.address, amount, account)
    }).then(() => {
      return sendVote(getKey(user, repo, issueNum), amount, account)
    }).catch((e) => {
      console.log(e);
    });
  }

  function voteButtonClick(user, repo, issueNum) {
    const tar = event.target
    enableVoting(false);
    tar.nextElementSibling.textContent = 'loading...';
    voteForIssue(user, repo, issueNum, 1).then(() => {
      return getVotesFor(getKey(user, repo, issueNum))
    }).then( (r) => {
      tar.nextElementSibling.textContent = r.c[0];
      enableVoting(true);
    });
  }

  function enableVoting(enable) {
    const voteButtons = document.querySelectorAll('.vote-btn');
    for (const button of voteButtons) {
      button.disabled = !enable
    }
  }
}
