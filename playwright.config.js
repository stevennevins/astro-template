import { defineConfig } from "@playwright/test";
import { MetaMaskWallet } from "@tenkeylabs/dappwright";

export default defineConfig({
	workers: 1, // Run serially to avoid browser session collisions
	testDir: "./test/e2e",
	fullyParallel: false,
	use: {
		headless: true,
		launchOptions: {
			args: ["--enable-gpu"],
		},
	},
	projects: [
		{
			name: "MetaMask",
			metadata: {
				wallet: "metamask",
				version: MetaMaskWallet.recommendedVersion,
				seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
				password: "password1234!@#$",
			},
		},
	],
	webServer: [
		{
			command: "npm run preview",
			url: "http://localhost:4321",
			timeout: 1000,
			reuseExistingServer: false,
		},
		{
			command: "anvil --port 8545",
			url: "http://localhost:8545",
			timeout: 5000,
			reuseExistingServer: true,
		},
	],
});
