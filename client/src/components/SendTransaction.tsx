import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const SendTransaction = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [receipent, setReceipent] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isValidPublickey = (address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleSend = async () => {
    if (!publicKey || !isValidPublickey(receipent)) return;
    try {
      setLoading(true);
      setStatus(null);

      const lamports = Number.parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receipent),
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      setStatus({
        type: "success",
        message: `Successfully sent ${amount} SOL to ${receipent.slice(
          0,
          6
        )}...${receipent.slice(-4)}!`,
      });

      // Reset form
      setAmount("");
    } catch (error) {
      console.error("Error sending transaction:", error);
      setStatus({
        type: "error",
        message: `Failed to send transaction: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    receipent &&
    isValidPublickey(receipent) &&
    amount &&
    Number.parseFloat(amount) > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Send SOL</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            value={receipent}
            onChange={(e) => setReceipent(e.target.value)}
            placeholder="Enter Solana address"
          />
          {receipent && !isValidPublickey(receipent) && (
            <p className="text-xs text-destructive">Invalid Solana address</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.000001"
            step="0.000001"
            placeholder="0.0"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={loading || !publicKey || !isFormValid}
          className="w-full"
        >
          {loading ? "Processing..." : "Send SOL"}
        </Button>
      </div>

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

export default SendTransaction;
