# ZKETA - Zero Knowledge ETA Verification

A zero-knowledge proof system for verifying estimated time of arrival (ETA) claims without revealing location data.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v16 or higher
- Git
- Rust (for Circom)
- Circom compiler
- MetaMask browser extension

### Installing Circom

1. Install Rust:
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

2. Install Circom compiler:
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

## Project Setup

1. Clone the repository:
git clone <repository-url>
cd zketa


2. Install dependencies:
npm install

3. Create a `.env.local` file:
REACT_APP_INFURA_URL=https://sepolia.infura.io/v3/YOUR-INFURA-PROJECT-ID
REACT_APP_RELAYER_PRIVATE_KEY=your-wallet-private-key

Create a '.env' file:
INFURA_URL=
RELAYER_PRIVATE_KEY=

## Development Workflow

1. Compile the zero-knowledge circuit:
npm run compile:circuit

This command will:
- Download the Powers of Tau file
- Compile the circuit
- Generate proving keys

2. Start a local Hardhat node in a terminal:

npm run node

3. In a new terminal, deploy the contracts:

npm run deploy:contracts
4. Start the React development server:
npm start