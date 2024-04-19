let Ballot = artifacts.require("./Ballot.sol");

let ballotInstance;

contract("Ballot contract", (accounts) => {
    /**
     * Account[0] is the default account
     * Test case 1
     */
    it("Contract deployment", () => {
        return Ballot.deployed().then((instance) => {
            ballotInstance = instance;
            assert(ballotInstance !== undefined, "Ballot contract should be defined");
        });
    });

    // Test case 2
    it("Valid user registration", () => {
        return ballotInstance.register(accounts[1], {from: accounts[0]}).then((result) => {
            assert.equal('0x01', result.receipt.status, "Registration is valid");
            return ballotInstance.register(accounts[2], {from: accounts[0]});
        }).then((result) => {
            assert.equal('0x01', result.receipt.status, "Registration is valid");
            return ballotInstance.register(accounts[3], {from: accounts[0]});
        }).then((result) => {
            assert.equal('0x01', result.receipt.status, "Registration is valid");
        });
    });

    // Test case 3
    if("Valid voting", () => {
        return ballotInstance.vote(2, {from: accounts[0]}).then((result) => {
            assert.equal('0x01', result.receipt.status, "Voting is done");
            return ballotInstance.vote(1, {from: accounts[1]});
        }).then((result) => {
            assert.equal('0x01', result.receipt.status, "Voting is done");
            return ballotInstance.vote(1, {from: accounts[2]});
        }).then((result) => {
            assert.equal('0x01', result.receipt.status, "Voting is done");
            return ballotInstance.vote(1, {from: accounts[3]});
        }).then((result) => {
            assert.equal('0x01', result.receipt.status, "Voting is done");
        });
    });

    // Test case 4
    it("Validate winner", () => {
        return ballotInstance.winningProposal.call().then((result) => {
            assert.equal(1, result.toNumber(), "Winner is validated with the expected winner");
        });
    });

    /**
     * Negative tests
     * 
     * Test case 5
     */
    it("Should NOT accept unauthorised registration", () => {
        return ballotInstance.register(accounts[6], {from: accounts[1]})
          .then((result) => {
            /**
             * if the user had already handled the above failure in solidity, 
             * then this block is executed
             * Truffle would directly throw the revert error which will be caught
             */
            
            throw("Condition not implemented in smart contract")
          }).catch((e) => {
            /**
             * If the error is custom thrown, then the condition was not checked
             * and hence fail the test case - else pass the test case
             */

            if(e ==="Condition not implemented in smart contract") {
                assert(false);
            } else {
                assert(true);
            }
          });
    });

    /**
     * Test case 6
     */
    it("Should NOT accept unregistered user vote", () => {
        return ballotInstance.vote(1, {from: accounts[7]})
        .then((result) => {
            throw("Condition not implemented in smart contract");
        }).catch((e) => {
            if(e === "Condition not implemented in smart contract") {
                assert(false);
            } else {
                assert(true);
            }
        });
    });
});