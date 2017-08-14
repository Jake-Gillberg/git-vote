var addVoting = document.createElement('script');
addVoting.src = chrome.extension.getURL('dist/insertVotes.bundle.js');
addVoting.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(addVoting);
