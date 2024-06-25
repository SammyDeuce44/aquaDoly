import { test, expect } from '@playwright/test';
import { StartPage } from '../common/pages/start.page';

test.describe('Smoke Test', () => {

    test('Environment is setup', async ({ page }) => {
        console.log("System under test: " + process.env.URL)
    });

    test('AUT is accessible', async ({ page }) => {
        const cookiePage = new StartPage(page);
        await cookiePage.goto();
        await expect(cookiePage.getHeader).toBeVisible();
    });
});
