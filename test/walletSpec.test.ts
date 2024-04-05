import { expect } from '@playwright/test';
import { MetaMaskWallet } from '@tenkeylabs/dappwright';
import { testWithWallet as test } from './walletTest';

test.describe('when interacting with the wallet', () => {
  test('should lock and unlock', async ({ wallet }) => {
    await wallet.lock();
    await wallet.unlock('password1234!@#$');
  });

  test.describe('account management', () => {
    test.describe('createAccount', () => {
      test('should create a new wallet/account', async ({ wallet }) => {
        await wallet.createAccount();

        const expectedAccountName = wallet instanceof MetaMaskWallet ? 'Account 2' : 'Wallet 2';
        expect(wallet.page.getByText(expectedAccountName));
      });
    });

    test.describe('switchAccount', () => {
      test('should switch accounts', async ({ wallet }) => {
        await wallet.switchAccount(1);

        const expectedAccountName = wallet instanceof MetaMaskWallet ? 'Account 1' : 'Wallet 1';
        expect(wallet.page.getByText(expectedAccountName));
      });
    });
  });

  test.describe('network configurations', () => {
    const options = {
      networkName: 'Cronos',
      rpc: 'https://evm.cronos.org',
      chainId: 25,
      symbol: 'CRO',
    };

    test.describe('hasNetwork', () => {
      test('should return true if a network has been configured', async ({ wallet }) => {
        expect(await wallet.hasNetwork('Ethereum')).toBeTruthy();
      });

      test('should return false if a network has not been configured', async ({ wallet }) => {
        expect(await wallet.hasNetwork('not there')).toBeFalsy();
      });
    });

    test.describe('addNetwork', () => {
      test('should configure a new network', async ({ wallet }) => {
        await wallet.addNetwork(options);

        expect(await wallet.hasNetwork(options.networkName)).toBeTruthy();
      });

      test('should fail if network already exists', async ({ wallet }) => {
        await expect(
          wallet.addNetwork({
            networkName: 'Cronos',
            rpc: 'https://evm.cronos.org',
            chainId: 25,
            symbol: 'CRO',
          }),
        ).rejects.toThrowError(SyntaxError);
      });
    });

    test.describe('switchNetwork', () => {
      test('should switch network, localhost', async ({ wallet }) => {
        if (wallet instanceof MetaMaskWallet) {
          await wallet.switchNetwork('Goerli');

          const selectedNetwork = wallet.page.getByTestId('network-display').getByText('Goerli');
          expect(selectedNetwork).toBeVisible();
        } else {
          console.warn('Coinbase skips network switching');
        }
      });
    });

    test.describe('deleteNetwork', () => {
      test('should delete a network configuration', async ({ wallet }) => {
        await wallet.deleteNetwork(options.networkName);

        expect(await wallet.hasNetwork(options.networkName)).toBeFalsy();
      });
    });

  });
});

