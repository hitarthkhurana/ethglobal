export const NETWORKS = {
    zircuitTestnet: {
      chainId: 48899,
      rpcUrl: "https://zircuit1-testnet.p2pify.com",
      verifierAddress: "0x2692Aa1d5B18deD1a579Ad4f23674134C3EEbEd7"
    },
    sepolia: {
      chainId: 11155111,
      rpcUrl: "https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}",
      verifierAddress: "0xb0b459a61abc8f816b9da1402B4119DD631e0A39"
    }
  };