import react from "react";
import web3 from "web3";


const App = () => {
// is there an injected web3 instance?
if (typeof web3!== "undefined") {
  App.web3Provider = web3.currentProvider;
} else {
  // if no injected web3 instance detected, fall back to ganache
  App.web3Provider = new web3.providers("http://localhost:9545");
}
// eslint-disable-next-line no-import-assign
web3 = new web3(App.web3Provider);


// Tell contract where to find the artifacts
$.getJSON("Ballot.json", ((data) => {
  // get necessary contract artifact and instantiate it with truffle contract
  var voteArtifact = data;
  App.contracts.vote.setProvider(App.web3Provider);

  // call method that handles events
  return App.bindEvents;
  
}));

}

export default App