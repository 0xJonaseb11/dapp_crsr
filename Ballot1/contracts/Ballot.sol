// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

 /**
    * @title Ballot
    * @dev Implements voting full logic as welll as delegation
     */

contract Ballot {

   

    address public chairperson;
    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;

    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only the chairperson can give the right to vote");
        require(!voters[voter].voted, "The voter has already voted");
        require(voters[voter].weight == 0, "The voter's weight should be 0");
        
        voters[voter].weight = 1;
    }

    // Delegate your vote to the voter
    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "You have no right to vote");
        require(!sender.voted, "You already voted");
        require(to != msg.sender, "Self-delegation is not allowed");

        // we found a while loop in the contract which is dangerous
        while(voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // the loop is avoided to run
            require(to != msg.sender, "Found loop in delegation of which is not allowed");
        }
        Voter storage delegate_ = voters[to];

        // Voters cannot delegate to accounts that cannot vote
        require(delegate_.weight >= 1, "Cannot delegate to accounts that cannot vote");

        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {
             // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet, add to their weight
            delegate_.weight += sender.weight;
        }
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Voter has not right to vote");
        require(!sender.voted, "Voter has already voted");
        sender.voted = true;
        sender.vote = proposal;

        //  If `proposal` is out of the range of the array,
        // this will throw automatically and revert all changes
        proposals[proposal].voteCount += sender.weight;
    }

    /**
    * @dev computes the winnning proposal taking all previous votes into account
     */
     function winningProposal() public view returns(uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                
                winningProposal_ = p;

            }
        }
     }

     /**
     *Calls winningProposal() function to get the index
      of the winner contained in the proposals array and then
      returns the name of the winner 
      */

      function winnerName() external view returns(bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
      }

}