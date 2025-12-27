import "@/styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";

import type { AppProps } from "next/app";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";

import { Navigation } from "@/components/navigation";
import { TodoContract, NetworkId } from "@/config";

// NEAR Wallet Selector modules
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMeteorWalletApp } from "@near-wallet-selector/meteor-wallet-app";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";

const walletSelectorConfig = {
  network: NetworkId as "testnet" | "mainnet",
  createAccessKeyFor: TodoContract,

  modules: [
    setupMyNearWallet(),
    setupMeteorWallet(),
    setupMeteorWalletApp({ contractId: TodoContract }),
    setupBitteWallet(),
    setupHotWallet(),
    setupLedger(),
    setupSender(),
    setupHereWallet(),
    setupNearMobileWallet(),
    setupWelldoneWallet(),
  ],
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletSelectorProvider config={walletSelectorConfig as any}>
      <Navigation />
      <Component {...pageProps} />
    </WalletSelectorProvider>
  );
}
