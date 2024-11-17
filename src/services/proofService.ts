import * as snarkjs from "snarkjs";
import { ethers } from "ethers";
import { NETWORKS } from "../networks";
import axios from "axios";

// Use Zircuit testnet by default
const NETWORK = NETWORKS.zircuitTestnet;
const ZKETA_VERIFIER_ADDRESS = NETWORK.verifierAddress;

export class ZKProofService {
  private initialized: boolean = false;
  private relayerWallet: ethers.Wallet;

  async init() {
    const provider = new ethers.JsonRpcProvider(NETWORK.rpcUrls[0]);
    this.relayerWallet = new ethers.Wallet(process.env.REACT_APP_RELAYER_PRIVATE_KEY, provider);
    
    console.log("Wallet address:", this.relayerWallet.address);
    const balance = await this.relayerWallet.provider.getBalance(this.relayerWallet.address);
    console.log("Wallet balance:", ethers.formatEther(balance), "ETH");
    
    this.initialized = true;
  }

  async generateProof(inputs: {
    claimedETA: number;
    actualETA: number;
    tolerance: number;
  }) {
    if (!this.initialized) {
      throw new Error("ProofService not initialized");
    }

    console.log("=== PROOF GENERATION START ===");
    console.log("Raw inputs:", JSON.stringify(inputs, null, 2));

    // Scale all inputs to positive integers and ensure they're within valid ranges
    const claimedETA = Math.floor(Math.min(100, Math.max(0, inputs.claimedETA)));
    const actualETA = Math.floor(Math.min(100, Math.max(0, inputs.actualETA)));
    const tolerance = Math.floor(Math.min(20, Math.max(1, inputs.tolerance)));

    console.log("Scaled inputs:", {
      claimedETA,
      actualETA,
      tolerance,
      difference: Math.abs(claimedETA - actualETA)
    });

    try {
      const circuitInputs = {
        claimedETA: claimedETA.toString(),
        actualETA: actualETA.toString(),
        tolerance: tolerance.toString()
      };
      
      console.log("Circuit inputs:", JSON.stringify(circuitInputs, null, 2));
      console.log("Debug values:", {
        subtraction: claimedETA - actualETA,
        absoluteDifference: Math.abs(claimedETA - actualETA),
        withinTolerance: Math.abs(claimedETA - actualETA) <= tolerance,
        toleranceCheck: `${Math.abs(claimedETA - actualETA)} <= ${tolerance}`
      });

      const wasmPath = "./build/circuits/ETACircuit_js/ETACircuit.wasm";
      const zkeyPath = "./build/circuits/ETACircuit_0000.zkey";

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInputs,
        wasmPath,
        zkeyPath
      );

      console.log("Proof generated successfully:", {
        publicSignals: publicSignals.map(s => s.toString()),
        proofSummary: {
          a: proof.pi_a.map(x => x.substring(0, 10) + "..."),
          b: proof.pi_b.map(x => x.map(y => y.substring(0, 10) + "...")),
          c: proof.pi_c.map(x => x.substring(0, 10) + "...")
        }
      });

      return { proof, publicSignals, verified: false };
    } catch (error) {
      console.error("=== PROOF GENERATION ERROR ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
      console.error("Circuit state:", {
        inputs: circuitInputs,
        calculations: {
          difference: Math.abs(claimedETA - actualETA),
          toleranceCheck: tolerance
        }
      });
      throw error;
    }
  }

  async verifyProofOnChain(proof: any, publicSignals: any, destination: string) {
    if (!this.initialized) {
      throw new Error("ProofService not initialized");
    }

    // Check if the difference is within tolerance
    const claimedETA = parseInt(publicSignals[0]);
    const actualETA = parseInt(publicSignals[1]);
    const tolerance = parseInt(publicSignals[2]);
    const difference = Math.abs(claimedETA - actualETA);

    if (difference > tolerance) {
      return {
        verified: false,
        actualETA: actualETA,
        destination,
        error: `ETA difference (${difference}) exceeds tolerance (${tolerance})`
      };
    }

    // Convert proof arrays to BigInt strings and transpose pi_b
    const proofForContract = {
      a: proof.pi_a.slice(0, 2).map((x: string) => x.toString()),
      b: [
        proof.pi_b[0].map((x: string) => x.toString()),
        proof.pi_b[1].map((x: string) => x.toString())
      ],
      c: proof.pi_c.slice(0, 2).map((x: string) => x.toString())
    };

    // Format signals according to contract requirements
    const formattedSignals = [
      ...publicSignals.map((s: string) => s.toString()),
      "0",
      "0"
    ].slice(0, 6);

    try {
      const verifier = new ethers.Contract(
        ZKETA_VERIFIER_ADDRESS,
        ["function verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[6],string) public returns (bool)"],
        this.relayerWallet
      );

      // Convert all parameters to strings before passing to contract
      const tx = await verifier.verifyProof(
        proofForContract.a,
        proofForContract.b,
        proofForContract.c,
        formattedSignals,
        destination,
        { 
          gasLimit: 3000000 // Set fixed gas limit for now
        }
      );

      const receipt = await tx.wait();
      return {
        verified: receipt.status === 1,
        actualETA: parseInt(publicSignals[1]),
        destination,
        txHash: tx.hash
      };
    } catch (error) {
      console.error("Verification error details:", {
        error,
        proofStructure: proofForContract,
        signals: formattedSignals,
        destination
      });

      return {
        verified: false,
        actualETA: parseInt(publicSignals[1]),
        destination,
        error: error.message
      };
    }
  }
}

export default new ZKProofService();
