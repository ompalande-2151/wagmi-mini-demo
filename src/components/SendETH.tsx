"use client";

import { useState } from "react";

import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

import { parseEther } from "viem";

export default function SendETH() {
    const [to, setTo] = useState("");

    const [amount, setAmount] =
        useState("");

    const { data: hash, isPending, sendTransaction } =
        useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash,
    });

    const handleSend = () => {
        if (!to || !amount) {
            alert("Please fill all fields");

            return;
        }

        sendTransaction({
            to: to as `0x${string}`,
            value: parseEther(amount),
        });
    };

    return (
        <div className="border p-4 rounded-xl space-y-4 mt-6">
            <h2 className="text-xl font-bold">
                Send ETH
            </h2>

            <input
                type="text"
                placeholder="Receiver Wallet Address"
                value={to}
                onChange={(e) =>
                    setTo(e.target.value)
                }
                className="w-full border p-2 rounded-lg"
            />

            <input
                type="number"
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) =>
                    setAmount(e.target.value)
                }
                className="w-full border p-2 rounded-lg"
            />

            <button
                disabled={isPending}
                onClick={handleSend}
                className="bg-black text-white px-4 py-2 rounded-lg w-full disabled:bg-gray-400"
            >
                {isPending ? "Confirming..." : "Send ETH"}
            </button>
            {hash && <div className="text-sm truncate">Transaction Hash: {hash}</div>}
            {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
            {isConfirmed && (
                <>
                    <div className="text-sm text-green-600 font-bold">Transaction confirmed!</div>
                    {receipt?.contractAddress && (
                        <div className="text-sm truncate mt-2">
                            Contract Address: {receipt.contractAddress}
                        </div>
                    )}
                    {receipt?.to && !receipt?.contractAddress && (
                        <div className="text-sm truncate mt-2">
                            Recipient Address: {receipt.to}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}