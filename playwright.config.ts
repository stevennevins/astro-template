import { defineConfig } from "@playwright/test";
import { CoinbaseWallet, MetaMaskWallet } from "@tenkeylabs/dappwright";
export default defineConfig({
workers: 1, // Run serially to avoid browser session collisions
  use: {
    headless: true,
  },
 projects: [
    {
      name: "MetaMask",
      metadata: {
        wallet: "metamask",
        version: MetaMaskWallet.recommendedVersion,
        seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
      },
    },
  ],
  webServer: [
    {
      command: "npm run preview",
      url: "http://localhost:4321",
      timeout: 5000,
      reuseExistingServer: true,
    },
    {
      command: "anvil --port 8545",
      url: "http://localhost:8545",
      timeout: 5000,
      reuseExistingServer: true,
    },
  ],
});
