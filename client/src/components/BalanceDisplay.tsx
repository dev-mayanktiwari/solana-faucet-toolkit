import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const BalanceDisplay = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-extrabold">SOL Balance</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchBalance}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="rounded-lg p-6 bg-muted text-center">
        {loading ? (
          <Skeleton className="h-10 w-32 mx-auto" />
        ) : balance !== null ? (
          <div className="text-3xl font-bold">
            {balance?.toLocaleString()} SOL
          </div>
        ) : (
          <div className="text-muted-foreground">Unable to fetch balance</div>
        )}
      </div>

      {publicKey && (
        <div className="mt-4 text-sm text-muted-foreground break-all">
          <p className="font-medium">Wallet Address:</p>
          <p>{publicKey.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default BalanceDisplay;
