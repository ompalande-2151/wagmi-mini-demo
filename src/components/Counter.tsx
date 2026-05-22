"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useTransactionCount } from "wagmi";
import { isAddress } from "viem";

const abi = [
  {
    inputs: [],
    name: "inc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "x",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function Counter() {
  const [contractAddress, setContractAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const validAddress = isAddress(contractAddress);

  const { address: userAddress } = useAccount();
  const { data: txCount, refetch: refetchTxCount } = useTransactionCount({
    address: userAddress,
  });

  const { data: countData, refetch: refetchCount, isFetching } = useReadContract({
    address: validAddress ? (contractAddress as `0x${string}`) : undefined,
    abi,
    functionName: "x",
    query: {
      enabled: Boolean(validAddress),
    },
  });

  const { data: txData, isPending: isSending, writeContractAsync } = useWriteContract({
    mutation: {
      onError(err: any) {
        setError(err?.message ?? "Transaction failed");
      },
      onSuccess() {
        setError(null);
        // refresh the count after a successful send
        setTimeout(() => refetchCount?.(), 1000);
      },
    }
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txData,
  });

  const handleIncrement = async () => {
    if (!validAddress) {
      setError("Please enter a valid deployed Counter contract address.");
      return;
    }

    setError(null);
    try {
      const txHash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "inc",
        args: [],
      });

      if (txHash) {
        const tx = typeof txHash === "string" ? txHash : String(txHash);
        setLastTxHash(tx);
        setAwaitingConfirmation(true);
        setLogs((s) => [...s, `Increment tx: ${tx}`]);
      }
    } catch (e) {
      setError((e as Error)?.message ?? "Transaction failed");
    }
  };

  useEffect(() => {
    if (validAddress) {
      setError(null);
      // auto-refresh count when a valid address is provided
      refetchCount?.();
    } else if (contractAddress) {
      setError("Invalid contract address");
    } else {
      setError(null);
    }
  }, [contractAddress, validAddress, refetchCount]);

  // when transaction is confirmed, refresh count and log result
  useEffect(() => {
    if (lastTxHash && awaitingConfirmation && isConfirming === false && isConfirmed) {
      (async () => {
        setLogs((s) => [...s, "Transaction confirmed!"]);
        try {
          const { data } = await refetchCount?.() || {};
          const newCount = data ?? countData;
          setLogs((s) => [...s, `Count after increment: ${newCount !== undefined && newCount !== null ? newCount.toString() : "-"}`]);
        } catch (_) {
          setLogs((s) => [...s, "Failed to refresh count"]);
        } finally {
          setAwaitingConfirmation(false);
          setLastTxHash(null);
          refetchTxCount?.();
        }
      })();
    }
  }, [isConfirming, isConfirmed, lastTxHash, awaitingConfirmation, refetchCount, countData]);

  return (
    <div className="border p-4 rounded-xl space-y-4 mt-6">
      <h2 className="text-xl font-bold">Counter</h2>

      <input
        type="text"
        placeholder="Counter contract address (0x...)"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        className="w-full border p-2 rounded-lg"
      />

      <div className="flex gap-2">
        <button
          onClick={() => refetchCount?.()}
          className="border px-4 py-2 rounded-lg"
          disabled={!validAddress}
        >
          Show Total Count
        </button>

        <button
          onClick={handleIncrement}
          disabled={isSending || !validAddress}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isSending ? "Sending..." : "Increment"}
        </button>
      </div>

      {/* <div>
        <h3 className="font-bold">Count</h3>
        <p>
          {isFetching
            ? "Loading..."
            : countData !== undefined && countData !== null
              ? countData.toString()
              : validAddress
                ? "No count available"
                : "Enter a valid contract address"}
        </p>
      </div> */}
      {/* 
      <div>
        <h3 className="font-bold">Logs</h3>
        <div className="text-sm h-32 overflow-auto p-2 border rounded bg-gray-50">
          {logs.length === 0 ? <div className="text-gray-500">No logs yet</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div> */}

      {error && <div className="text-sm text-red-600">{error}</div>}

      {txData && <div className="text-sm truncate">Transaction Hash: {txData}</div>}
      {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
      {isConfirmed && (
        <div className="text-sm text-green-600 font-bold">Transaction confirmed!</div>
      )}

      {txCount !== undefined && (
        <div className="text-sm mt-2 text-gray-700 font-medium">Your Transaction Count (Nonce): {txCount}</div>
      )}
    </div>
  );
}
