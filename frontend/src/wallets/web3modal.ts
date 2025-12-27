import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { nearTestnet } from "@reown/appkit/networks";

const projectId = "30147604c5f01d0bc4482ab0665b5697";

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [nearTestnet],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig; // ✅ THIS IS WHAT NEAR SELECTOR EXPECTS

export const web3Modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [nearTestnet],
  enableWalletConnect: true,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
  },
  coinbasePreference: "eoaOnly",
  allWallets: "SHOW",
});
