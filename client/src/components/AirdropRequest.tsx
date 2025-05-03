import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const AirdropRequest = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const requestAirdrop = async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      setStatus(null);

      const lamports = Number.parseFloat(amount) * LAMPORTS_PER_SOL;

      const signature = await connection.requestAirdrop(publicKey, lamports);
      await connection.confirmTransaction(signature);

      setStatus({
        type: "success",
        message: `Successfully airdropped ${amount} to your wallet!`,
      });
    } catch (error) {
      console.error("Error requesting airdrop:", error);
      setStatus({
        type: "error",
        message: `Failed to request airdrop: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Request Airdrop</h2>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (SOL)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0.1}
          max={10}
          step={0.1}
        />
        <p className="text-xs text-muted-foreground">
          Note: Airdrops are only available on devnet.
        </p>
      </div>

      <Button
        onClick={requestAirdrop}
        disabled={loading || !publicKey}
        className="w-full"
      >
        {loading ? "Processing..." : "Request Airdrop"}
      </Button>

      {status && (
        <Alert variant={status.type === "success" ? "default" : "destructive"}>
          {status.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {status.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AirdropRequest;
