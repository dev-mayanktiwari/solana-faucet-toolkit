import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletInterface from "./components/WalletInterface";
import { ThemeProvider } from "./components/theme-provider";

const rpcUrl =
  import.meta.env.VITE_CUSTOM_RPC || "https://api.devnet.solana.com";

const App: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => rpcUrl, []);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* <WalletMultiButton />
          <WalletDisconnectButton /> */}
            {/* Your app's components go here, nested within the context providers. */}
            <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
              <div className="w-full max-w-3xl">
                <h1 className="mb-8 text-center text-3xl font-bold">
                  Solana Faucet Toolkit
                </h1>
                <WalletInterface />
              </div>
            </main>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
