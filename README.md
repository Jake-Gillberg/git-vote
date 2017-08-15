# git-vote

Chrome extension that allows voting on GitHubIssues using an ERC20 token. (Created for Rchain)

## Installing
1.  [download this repo](https://github.com/Jake-Gillberg/git-vote/archive/master.zip)
2.  unzip the downloaded file
3.  in chrome go to `chrome://extensions/`
4.  select `Load unpacked extension...`
5.  select the directory you unzipped in step 2 (the directory should contain at its top level `manifest.json`)
6.  install [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or something else that will inject web3

## Using
You should now see vote buttons on any [github.com/user/repo/issues](https://github.com/rchain/Members/issues).

each push of a vote button will require **2 transactions**, 1 transaction is to the ERC20 token to approve the transfer, and the second transaction is to the voting contract.
