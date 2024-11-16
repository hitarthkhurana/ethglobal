import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const networkName = hre.network.name;
  console.log(`Deploying to ${networkName}...`);

  // Deploy Verifier
  const ETACircuitVerifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await ETACircuitVerifier.deploy();
  await verifier.waitForDeployment();
  
  const verifierAddress = await verifier.getAddress();
  console.log(`ETACircuitVerifier deployed to ${networkName}:`, verifierAddress);

  // Deploy ZKETAVerifier
  const ZKETAVerifier = await ethers.getContractFactory("ZKETAVerifier");
  const zkVerifier = await ZKETAVerifier.deploy(verifierAddress);
  await zkVerifier.waitForDeployment();
  
  const zkVerifierAddress = await zkVerifier.getAddress();
  console.log(`ZKETAVerifier deployed to ${networkName}:`, zkVerifierAddress);

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deployments = {
    network: networkName,
    chainId: Number(network.chainId),
    ETACircuitVerifier: verifierAddress,
    ZKETAVerifier: zkVerifierAddress,
    timestamp: new Date().toISOString()
  };

  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments");
  }
  
  fs.writeFileSync(
    `./deployments/${networkName}.json`,
    JSON.stringify(deployments, null, 2)
  );

  // Verify contracts if not on local network
  if (networkName !== "localhost" && networkName !== "hardhat") {
    console.log("Waiting for block confirmations...");
    // Wait for a few blocks to ensure deployment is confirmed
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

    console.log("Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: verifierAddress,
        constructorArguments: []
      });

      await hre.run("verify:verify", {
        address: zkVerifierAddress,
        constructorArguments: [verifierAddress]
      });
    } catch (error) {
      console.error("Verification error:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});