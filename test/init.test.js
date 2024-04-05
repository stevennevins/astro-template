import { expect } from "@playwright/test";
import { testWithWallet as test } from "./walletTest";

test.describe(`when the test environment is initialized`, () => {
	test("should open, test page", async ({ page }) => {
		expect(page).toBeTruthy();

		await page.goto("http://localhost:4321");
		// expect(await page.title()).toEqual("Local wallet test");
	});

	test("should open the wallet", async ({ wallet }) => {
		expect(wallet.page).toBeTruthy();
	});
});
