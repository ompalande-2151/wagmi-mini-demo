"use client";
import SendETH from "@/components/SendETH";
import Counter from "@/components/Counter";
import {
  ConnectButton,
} from "@rainbow-me/rainbowkit";

import {
  useAccount,
  useBalance,
  useSwitchChain,
} from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data } = useBalance({
    address,
  });

  const { chains, switchChain } =
    useSwitchChain();


  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Web3 Dashboard
      </h1>
      <ConnectButton />
      {isConnected && (
        <div className="border p-6 rounded-xl w-[400px] space-y-4">
          <div>
            <h2 className="font-bold">
              Wallet Address
            </h2>
            <p className="break-all">
              {address}
            </p>
          </div>


          

          <div>
            <h2 className="font-bold">
              ETH Balance
            </h2>
            <p>
              {data?.formatted} {data?.symbol}
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">
              Switch Network
            </h2>
            <div className="flex gap-2">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() =>
                    switchChain({
                      chainId: chain.id,
                    })
                  }
                  className="border px-3 py-2 rounded-lg"
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>
          {/* send eth */}
          <SendETH />
          <Counter />
        </div>
      )}
    </main>
  );
}