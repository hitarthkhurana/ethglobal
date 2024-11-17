export const NETWORKS = {
    zircuitTestnet: {
      chainId: 48899,
      rpcUrls: [
        "https://zircuit1-testnet.p2pify.com",
      ],
      verifierAddress: "0x4eF81a04F4ca71604463D2072bd0E8D88029e89F",
    },
    sepolia: {
      chainId: 11155111,
      rpcUrls: [
        `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
        "https://rpc.sepolia.org",
        "https://sepolia.gateway.tenderly.co"
      ],
      verifierAddress: "0xb0b459a61abc8f816b9da1402B4119DD631e0A39"
    }
  };

