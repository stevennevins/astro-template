import test from '@playwright/test';

import type { BrowserContext} from 'playwright-core';
import type { OfficialOptions, Dappwright } from '@tenkeylabs/dappwright';
import { bootstrap, getWallet, MetaMaskWallet} from '@tenkeylabs/dappwright';
let sharedBrowserContext: BrowserContext;

export const testWithWallet = test.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({ context: _ }, use, info) => {
    if (!sharedBrowserContext) {
      const projectMetadata = info.project.metadata as OfficialOptions;
      const [wallet, _, browserContext] = await bootstrap('', {
        ...projectMetadata,
        headless: info.project.use.headless,
      });

    await wallet.addNetwork({
        networkName: 'Localhost 8545',
        rpc: 'http://localhost:8545',
        chainId: 31337,
        symbol: 'ETH',
    });

    sharedBrowserContext = browserContext;
    }

    await use(sharedBrowserContext);
  },

  wallet: async ({ context }, use, info) => {
    const projectMetadata = info.project.metadata;
    const wallet = await getWallet(projectMetadata.wallet, context);
    await use(wallet);
  },
});
