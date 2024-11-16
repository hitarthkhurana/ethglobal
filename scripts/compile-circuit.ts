import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

async function executeCommand(command: string, errorMessage: string) {
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr) console.error(stderr);
        if (stdout) console.log(stdout);
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        throw error;
    }
}

async function main() {
    try {
        const circuitsDir = path.join(process.cwd(), 'src/circuits');
        const buildDir = path.join(process.cwd(), 'build/circuits');
        const contractsDir = path.join(process.cwd(), 'src/contracts');
        const circomLibDir = path.join(process.cwd(), 'node_modules/circomlib/circuits');

        // Create build directory
        fs.mkdirSync(buildDir, { recursive: true });

        // Download Powers of Tau file
        const ptauPath = path.join(buildDir, 'pot12_final.ptau');
        if (!fs.existsSync(ptauPath)) {
            console.log("Downloading Powers of Tau file...");
            await executeCommand(
                `curl -L -o ${ptauPath} https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau`,
                "Failed to download Powers of Tau"
            );
        }

        // Compile circuit with include path
        console.log("Compiling circuit...");
        await executeCommand(
            `circom ${circuitsDir}/ETACircuit.circom --wasm --r1cs --sym --c --wat -o ${buildDir} -l ${circomLibDir}`,
            "Failed to compile circuit"
        );

        // Generate proving key
        console.log("Generating proving key...");
        await executeCommand(
            `snarkjs groth16 setup ${buildDir}/ETACircuit.r1cs ${ptauPath} ${buildDir}/ETACircuit_0000.zkey`,
            "Failed to generate proving key"
        );

        // Generate Solidity verifier
        console.log("Generating Solidity verifier...");
        await executeCommand(
            `snarkjs zkey export solidityverifier ${buildDir}/ETACircuit_0000.zkey ${contractsDir}/ETACircuitVerifier.sol`,
            "Failed to generate Solidity verifier"
        );

        // Export verification key
        console.log("Exporting verification key...");
        await executeCommand(
            `snarkjs zkey export verificationkey ${buildDir}/ETACircuit_0000.zkey ${buildDir}/verification_key.json`,
            "Failed to export verification key"
        );

        console.log("Circuit compilation complete!");
    } catch (error) {
        console.error("Failed to compile circuit:", error);
        process.exit(1);
    }
}

main();