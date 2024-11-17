// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool);
}

contract ZKETAVerifier {
    IVerifier public immutable verifier;
    
    event ProofVerified(
        bytes32 indexed proofHash,
        address indexed verifier,
        string destination,
        uint256 actualETA,
        bool verified,
        uint256 timestamp
    );

    mapping(bytes32 => bool) public verifiedProofs;

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input,
        string memory destination
    ) public returns (bool) {
        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, input));
        require(!verifiedProofs[proofHash], "Proof already verified");
        
        bool isValid = verifier.verifyProof(a, b, c, input);
        
        verifiedProofs[proofHash] = true;
        emit ProofVerified(proofHash, msg.sender, destination, input[2], isValid, block.timestamp);
        return isValid;
    }
}