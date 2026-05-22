import { network } from "hardhat";

const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const { viem } = await network.create({ network: "localhost" });
const contract = await viem.getContractAt("Counter", address);
const publicClient = await viem.getPublicClient();

console.log("Initial count:", await contract.read.x());

const [walletClient] = await viem.getWalletClients();
const txHash = await contract.write.inc([], { account: walletClient.account.address });
console.log("Increment tx:", txHash);
await publicClient.waitForTransactionReceipt({ hash: txHash });
console.log("Count after increment:", await contract.read.x());
