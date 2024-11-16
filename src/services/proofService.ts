import * as snarkjs from "snarkjs";
import { ethers } from "ethers";

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

  async verifyProofOnChain(proof: any, publicSignals: any) {
    if (!this.initialized) {
      throw new Error("ProofService not initialized");
    }

    // Format signals
    const formattedSignals = publicSignals.map((signal: string) => BigInt(signal));
    
    // Format proof structure to match contract expectations
    const formattedProof = {
      a: [proof.a[0], proof.a[1]],
      b: [[proof.b[0][0], proof.b[0][1]], [proof.b[1][0], proof.b[1][1]]],
      c: [proof.c[0], proof.c[1]]
    };

    console.log("Formatted proof:", formattedProof);
    console.log("Formatted signals:", formattedSignals);

    const verifierABI = [
      "function verifyProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[6] memory input) public returns (bool)"
    ];
    const verifierAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const verifier = new ethers.Contract(verifierAddress, verifierABI, this.relayerWallet);
    
    try {
      const tx = await verifier.verifyProof(
        formattedProof.a,
        formattedProof.b,
        formattedProof.c,
        formattedSignals
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Verification error:", error);
      return false;
    }
  }
}

export default new ZKProofService();