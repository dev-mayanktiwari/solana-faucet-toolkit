import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "@radix-ui/react-label";

const SignMessage = () => {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSign = async () => {
    if (!publicKey || !signMessage || !message) return;
    try {
      setLoading(true);
      setStatus(null);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);

      const signBase64 = Buffer.from(signatureBytes).toString("base64");
      setSignature(signBase64);
      setStatus({
        type: "success",
        message: "Message signed successfully!",
      });
    } catch (error) {
      console.error("Error signing message:", error);
      setStatus({
        type: "error",
        message: `Failed to sign message: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
      setSignature(null);
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sign Message</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to sign"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSign}
          disabled={loading || !publicKey || !message}
          className="w-full"
        >
          {loading ? "Signing..." : "Sign Message"}
        </Button>
      </div>

      {signature && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <Label>Signature</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(signature)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs break-all font-mono">{signature}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            This signature proves you own the private key to your wallet
            address.
          </p>
        </div>
      )}

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

export default SignMessage;
