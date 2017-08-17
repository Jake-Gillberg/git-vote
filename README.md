# git-vote

Chrome extension that allows voting on GitHubIssues using an ERC20 token. (Created for Rchain)

![vote buttons with vote count added to issues listing](screenshots/git-vote%20in%20action.png?raw=true)

## Installing
1.  [download this repo](https://github.com/Jake-Gillberg/git-vote/archive/master.zip)
2.  unzip the downloaded file
3.  in chrome go to `chrome://extensions/`
4.  ensure that the "Developer mode" checkbox in the top right-hand corner is checked
5.  select `Load unpacked extension...`
6.  select the directory you unzipped in step 2 (the directory should contain at its top level `manifest.json`)
7.  install [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or something else that will inject web3

## Using
You should now see vote buttons on any [github.com/user/repo/issues](https://github.com/rchain/Members/issues).

each push of a vote button will require **2 transactions**, 1 transaction is to the ERC20 token to approve the transfer, and the second transaction is to the voting contract.

## Testing
Deployed on the Ropsten testnet: 0xF27aF37CDBf995CF78da58bCa6071C705bA10FbC

test "RHOC" address: 0xb55d53e953e4B81BA637B9Fe16e17D11233f5fB1 (let me know if you need some)

Please throw any comments or suggestions my way! Thanks!
