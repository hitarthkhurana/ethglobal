import { useState } from 'react'
import './App.css'
import {
  createExtensionWebProofProvider,
  expectUrl,
  notarize,
  startPage,
} from "@vlayer/sdk/web_proof";
import { createContext } from "@vlayer/sdk/config";
import { Hex } from "viem";

const { chain, ethClient, account, proverUrl, confirmations } =
  await createContext({
    chainName: import.meta.env.VITE_CHAIN_NAME,
    proverUrl: import.meta.env.VITE_PROVER_URL,
    jsonRpcUrl: import.meta.env.VITE_JSON_RPC_URL,
    privateKey: import.meta.env.VITE_PRIVATE_KEY,
  });

function App() {
  

  const handleSetupProveButton = async (element) => {
    element.addEventListener("click", async () => {
      const provider = createExtensionWebProofProvider();
      const webProof = await provider.getWebProof({
        proverCallCommitment: {
          address: import.meta.env.VITE_PROVER_ADDRESS,
          proverAbi: webProofProver.abi,
          chainId: foundry.id,
          functionName: "main",
          commitmentArgs: ["0x"],
        },
        logoUrl: "http://twitterswap.com/logo.png",
        steps: [
          startPage("https://x.com/i/flow/login", "Go to x.com login page"),
          expectUrl("https://x.com/home", "Log in"),
          notarize(
            "https://api.x.com/1.1/account/settings.json",
            "GET",
            "Generate Proof of Twitter profile",
          ),
        ],
      });
  
      console.log("WebProof generated!", webProof);
      context.webProof = webProof;
    });
  }

  return (
    <>
      <div>
        <button onClick={handleSetupProveButton}>
          Request Webproof
        </button>
      </div>
    </>
  )
}

export default App
