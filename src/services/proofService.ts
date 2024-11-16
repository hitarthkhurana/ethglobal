import * as snarkjs from "snarkjs";
import { ethers } from "ethers";

// Add the address you get from deployment logs
const ZKETA_VERIFIER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export class ZKProofService {
  private initialized: boolean = false;
  private relayerWallet: ethers.Wallet;

  async init() {
    // For local development, use hardcoded values if env vars are not set
    const infuraUrl = process.env.REACT_APP_INFURA_URL ;
    const privateKey = process.env.REACT_APP_RELAYER_PRIVATE_KEY  // Default hardhat account

    const provider = new ethers.JsonRpcProvider(infuraUrl);
    this.relayerWallet = new ethers.Wallet(privateKey, provider);
    this.initialized = true;
  }

  async generateProof(inputs: {
    sourceLocation: [number, number],
    claimedETA: number,
    actualETA: number,
    tolerance: number
  }) {
    if (!this.initialized) {
      throw new Error("ProofService not initialized");
    }

    // Convert GPS coordinates to integers by multiplying by 1e8
    const SCALING_FACTOR = 100000000; // 1e8
    const scaledLatitude = Math.round(inputs.sourceLocation[0] * SCALING_FACTOR);
    const scaledLongitude = Math.round(inputs.sourceLocation[1] * SCALING_FACTOR);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      {
        sourceLatitude: scaledLatitude.toString(),
        sourceLongitude: scaledLongitude.toString(),
        claimedETA: inputs.claimedETA.toString(),
        actualETA: inputs.actualETA.toString(),
        tolerance: inputs.tolerance.toString()
      },
      '/build/circuits/ETACircuit.wasm',
      '/build/circuits/ETACircuit_0000.zkey'
    );

    return {
      proof: {
        a: proof.pi_a,
        b: proof.pi_b,
        c: proof.pi_c
      },
      publicSignals,
      verified: false
    };
  }

  async verifyProofOnChain(proof: any, publicSignals: any, destination: string) {
    if (!this.initialized) {
      throw new Error("ProofService not initialized");
    }

    const formattedSignals = publicSignals.map((signal: string) => BigInt(signal));
    const formattedProof = {
      a: [proof.a[0], proof.a[1]],
      b: [[proof.b[0][0], proof.b[0][1]], [proof.b[1][0], proof.b[1][1]]],
      c: [proof.c[0], proof.c[1]]
    };

    const verifierABI = [
      "function verifyProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[6] memory input, string memory destination) public returns (bool)"
    ];
    const verifier = new ethers.Contract(ZKETA_VERIFIER_ADDRESS, verifierABI, this.relayerWallet);
    
    try {
      const tx = await verifier.verifyProof(
        formattedProof.a,
        formattedProof.b,
        formattedProof.c,
        formattedSignals,
        destination
      );
      const receipt = await tx.wait();
      return {
        verified: true,
        actualETA: 0, // Hardcoded to 0 since that's what we pass in App.js
        destination
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        verified: false,
        actualETA: 0,
        destination
      };
    }
  }
}

export default new ZKProofService();