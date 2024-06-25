import { test, expect, type Page } from '@playwright/test';
import { StartPage } from '../common/pages/start.page';
import { GamePage } from '../common/pages/game.page';
import { GetGuidv4 } from '../common/utils/helper';

test.describe('Cookie Game', () => {
  
  let username;

  test.beforeEach(async ({ page, context }) => {
      username = 'AutomatedUser'.concat(GetGuidv4())
      const startPage = new StartPage(page);
      const gamePage = new GamePage(page);
      const expectedUsername = 'Hello '.concat(username);

      await startPage.goto();
      await expect(startPage.getHeader).toBeVisible();
      await startPage.usernameField.fill(username);
      await startPage.clickStartButton();
      await expect(gamePage.getHelloText).toContainText(expectedUsername);
  });

  test.afterEach(async ({ page }) => {
  });

  test('should navigate back to the Homepage', async ({ page }) => {
    const startPage = new StartPage(page);
    const gamePage = new GamePage(page);
    const expectedPageText = 'New Game';
    await gamePage.gotoStartPage();
    await expect(startPage.getNewGameText).toContainText(expectedPageText);
  });

  test('should show the default Labels as Zero', async ({ page }) => {
    const gamePage = new GamePage(page);
    const expectedPageText = '0';
    await expect(gamePage.getCookiesText).toContainText(expectedPageText);
    await expect(gamePage.getFactoriesText).toContainText(expectedPageText);
    await expect(gamePage.getMoneyText).toContainText(expectedPageText);
  });

  test('should add cookies 10 cookies', async ({ page }) => {
    const gamePage = new GamePage(page);
    const clickLimit = 10
    const expectedPageText = clickLimit.toString();
    await gamePage.clickCookiesButton(clickLimit);
    await expect(gamePage.getCookiesText).toContainText(expectedPageText);
  });

  test('should verify high score', async ({ page }) => {
    const startPage = new StartPage(page);
    const gamePage = new GamePage(page);
    const clickLimit = 10
    const expectedPageText = clickLimit.toString();

    // Do things in Gamepage
    await gamePage.clickCookiesButton(clickLimit);
    const expectedHighScore = await gamePage.getCookiesText.innerText()
    await expect(gamePage.getCookiesText).toContainText(expectedPageText);
    await gamePage.gotoStartPage();

    // Confim in StartPage
    await expect(startPage.getHeader).toBeVisible();
    const actualHighScore = await startPage.getHighScore(username)
    await expect(actualHighScore).toEqual(expectedHighScore);
  });

  test('should sell cookies', async ({ page }) => {
    const gamePage = new GamePage(page);
    const clickLimit = 11
    const cookiesForSale = 10
    const expectedCookies = "1"
    const expectedFactories = "0"
    const expectedMoney = "2.5"
    const expectedPageText = clickLimit.toString();
    await gamePage.clickCookiesButton(clickLimit);
    await expect(gamePage.getCookiesText).toContainText(expectedPageText);
    await gamePage.clickSellCookiesButton(cookiesForSale.toString());
    await expect(gamePage.getCookiesText).toContainText(expectedCookies);
    await expect(gamePage.getMoneyText).toContainText(expectedFactories);
    await expect(gamePage.getMoneyText).toContainText(expectedMoney);
  });

  test('should buy factories', async ({ page }) => {
    const gamePage = new GamePage(page);
    const clickLimit = 20
    const cookiesForSale = 19
    const factoryLimit = 1
    const expectedFactories = "1"
    const expectedMoneyAfterSale = "4.75"
    const expectedMoney = "1.75"
    const expectedPageText = clickLimit.toString();
    await gamePage.clickCookiesButton(clickLimit);
    await expect(gamePage.getCookiesText).toContainText(expectedPageText);
    await gamePage.clickSellCookiesButton(cookiesForSale.toString());
    await expect(gamePage.getMoneyText).toContainText(expectedMoneyAfterSale);
    await gamePage.clickBuyFactoriesButton(factoryLimit.toString());
    await expect(gamePage.getFactoriesText).toContainText(expectedFactories);
    await expect(gamePage.getMoneyText).toContainText(expectedMoney);
  });

  const acceptedFactoryValues = [
    '1',
    '+1',
    ];
  for (const factoryValue of acceptedFactoryValues) {
      test(`should successfully modify the Factory value: ${factoryValue}`, async ({ page }) => {
        const gamePage = new GamePage(page);
        const clickLimit = 13
        const cookiesForSale = 12
        const expectedMoneyAfterSale = "3"
        const expectedFactories = "1"
        const expectedMoney = "0"
        const expectedPageText = clickLimit.toString();
        
        await gamePage.clickCookiesButton(clickLimit);
        await expect(gamePage.getCookiesText).toContainText(expectedPageText);
        await gamePage.clickSellCookiesButton(cookiesForSale.toString());
        await expect(gamePage.getMoneyText).toContainText(expectedMoneyAfterSale);
        await gamePage.clickBuyFactoriesButton(factoryValue);
        await expect(gamePage.getFactoriesText).toContainText(expectedFactories);
        await expect(gamePage.getMoneyText).toContainText(expectedMoney);
      });
  }
});