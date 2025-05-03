"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import BalanceDisplay from "./BalanceDisplay";
import AirdropRequest from "./AirdropRequest";
import SendTransaction from "./SendTransaction";
import SignMessage from "./SignMessage";

const WalletInterface = () => {
  const { connected } = useWallet();

  const tableData = [
    {
      value: "balance",
      label: "Balance",
      displayComponent: BalanceDisplay,
    },
    {
      value: "airdrop",
      label: "Airdrop",
      displayComponent: AirdropRequest,
    },
    {
      value: "send",
      label: "Send",
      displayComponent: SendTransaction,
    },
    {
      value: "sign",
      label: "Sign",
      displayComponent: SignMessage,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center flex-col">
        <div className="flex items-center justify-center pb-10">
          <WalletMultiButton className="bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2" />
        </div>
        {connected ? (
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {tableData.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tableData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="p-6">
                  <tab.displayComponent />
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-lg">Connect your wallet to get started</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WalletInterface;
