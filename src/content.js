var addVoting = document.createElement('script');
addVoting.src = chrome.extension.getURL('dist/insertVotes.bundle.js');
addVoting.onload = function() { this.parentNode.removeChild(this); };
var container = document.head || document.documentElement;
container.insertBefore(addVoting, container.children[0]);
