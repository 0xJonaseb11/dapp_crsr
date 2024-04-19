let Ballot = artifacts.require("Ballot.sol");

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
        })
    })
})