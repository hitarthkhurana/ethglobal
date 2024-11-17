// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ETAProver {
    event ProofGenerated(
        bytes32 indexed proofHash,
        address indexed prover,
        uint256 timestamp
    );

    struct ETAProof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[6] input; // [claimedETA, actualETA, tolerance]
    }

    mapping(bytes32 => bool) public proofs;

    function generateProofHash(
        uint256[2] memory sourceLocation,
        uint256 claimedETA,
        uint256 actualETA
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            sourceLocation[0],
            sourceLocation[1],
            claimedETA,
            actualETA
        ));
    }

    function submitProof(ETAProof memory proof) public returns (bytes32) {
        bytes32 proofHash = generateProofHash(
            [proof.input[0], proof.input[1]],
            proof.input[2],
            proof.input[3]
        );
        
        require(!proofs[proofHash], "Proof already submitted");
        proofs[proofHash] = true;
        
        emit ProofGenerated(proofHash, msg.sender, block.timestamp);
        return proofHash;
    }
}