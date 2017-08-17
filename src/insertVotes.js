import ERC20VotingContract from '../build/contracts/ERC20Voting.json'
import ERC20Contract from '../build/contracts/ERC20.json'

const Contract = require('truffle-contract');

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  document.addEventListener('pjax:end', addVotingIfIssues, false);
  addVotingIfIssues();
} else {
  console.log('No web3? You should consider trying MetaMask!');
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function addVotingIfIssues() {
  if(window.location.pathname.substring(1).split('/')[2] == "issues") {
    addVoting();
  }
}

function addVoting() {

  const ERC20Voting = Contract(ERC20VotingContract);
  const ERC20 = Contract(ERC20Contract);

  ERC20Voting.setProvider(web3.currentProvider);
  ERC20.setProvider(web3.currentProvider);

  const issues = document.querySelectorAll('li.js-issue-row');

  for (const issue of issues) {

    const table = issue.querySelector('.d-table');

    const issueLinkCol = table.querySelector('.col-9');
    if (issueLinkCol != null) {
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
      voteButton.addEventListener('click', function() {
        voteButtonClick(ERC20Voting, ERC20, user, repo, issueNum);
      });
      voteButton.appendChild(document.createTextNode('vote'));
      numVotes.className = 'social-count';
      numVotes.textContent = 'loading...';
      getVotesFor(ERC20Voting, getKey(user, repo, issueNum)).then( (r) => {
        numVotes.textContent = r.c[0];
      });

      innerDiv.appendChild(voteButton);
      innerDiv.appendChild(numVotes);
      colDiv.appendChild(innerDiv);
      table.appendChild(colDiv);
    }
  }
}

function getERC20VotingInstance(ERC20Voting) {
  return ERC20Voting.deployed();
}

function getERC20Instance(ERC20, ERC20Voting) {
  return getERC20VotingInstance(ERC20Voting).then((erc20VotingInstance) => {
    return erc20VotingInstance.token.call()
  }).then((erc20Address) => {
    return ERC20.at(erc20Address);
  });
}

function approveERC20Withdrawl(ERC20, ERC20Voting, spender, amount, account) {
  return getERC20Instance(ERC20, ERC20Voting).then((erc20Instance) => {
      return erc20Instance.approve(spender, amount, {from: account});
    });
}

function sendVote(ERC20Voting, key, amount, account) {
  return getERC20VotingInstance(ERC20Voting)
    .then((erc20VotingInstance) => {
      return erc20VotingInstance.vote(key, amount, {from: account});
    });
}

function getVotesFor(ERC20Voting, key) {
  return getERC20VotingInstance(ERC20Voting)
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

function voteForIssue(ERC20Voting, ERC20, user, repo, issueNum, amount) {
  var account;

  return getAccountsPromise().then((accounts) => {
    account = accounts[0];
    if (account == null) {
      console.log("An account must be unlocked, are you logged in to Metamask?");
      throw 'No web3 account';
    }
    return getERC20VotingInstance(ERC20Voting)
  }).then((votingInstance) => {
    return approveERC20Withdrawl(ERC20, ERC20Voting, votingInstance.address, amount, account)
  }).then(() => {
    return sendVote(ERC20Voting, getKey(user, repo, issueNum), amount, account)
  }).catch((e) => {
    console.log(e);
  });
}

function voteButtonClick(ERC20Voting, ERC20, user, repo, issueNum) {
  const tar = event.target
  enableVoting(false);
  tar.nextElementSibling.textContent = 'loading...';
  voteForIssue(ERC20Voting, ERC20, user, repo, issueNum, 1).then(() => {
    return getVotesFor(ERC20Voting, getKey(user, repo, issueNum))
  }).then( (r) => {
    tar.nextElementSibling.textContent = r.c[0];
    enableVoting(true);
  });
}

function enableVoting(enable) {
  const voteButtons = document.querySelectorAll('.vote-btn');
  for (const button of voteButtons) {
    button.disabled = !enable;
  }
}
