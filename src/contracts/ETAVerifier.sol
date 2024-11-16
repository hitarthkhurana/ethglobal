// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ETACircuitVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKETAVerifier is Ownable {
    Verifier public immutable verifier;
    
    event ProofVerified(
        bytes32 indexed proofHash,
        address indexed verifier,
        uint256 timestamp
    );

    mapping(bytes32 => bool) public verifiedProofs;

    constructor(address _verifier) Ownable(msg.sender) {
        verifier = Verifier(_verifier);
    }

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[6] memory input
    ) public returns (bool) {
        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, input));
        require(!verifiedProofs[proofHash], "Proof already verified");
        
        require(verifier.verifyProof(a, b, c, input), "Invalid proof");
        
        verifiedProofs[proofHash] = true;
        emit ProofVerified(proofHash, msg.sender, block.timestamp);
        return true;
    }
}