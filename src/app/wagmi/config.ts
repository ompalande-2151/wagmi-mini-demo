import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";

export const hardhatLocal = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
});

export const mstTestnet = defineChain({
  id: 91562037,
  name: 'MST Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tMSTC',
    symbol: 'tMSTC',
  },
  rpcUrls: {
    default: { http: ['https://testnetrpc.mstblockchain.com'] },
  },
  blockExplorers: {
    default: { name: 'MSTScan', url: 'https://testnet.mstscan.com' },
  },
});

export const config = getDefaultConfig({
    appName: "Web3 Dashboard",
    projectId: "6bc9a4076a71c322831d68954e896c5c",
    chains: [hardhatLocal, mstTestnet, mainnet, sepolia],
    ssr: true,
});