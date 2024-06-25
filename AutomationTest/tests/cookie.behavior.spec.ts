import { test, expect, type Page } from '@playwright/test';
import { StartPage } from '../common/pages/start.page';
import { GamePage } from '../common/pages/game.page';

test.describe('Repetitive Factory Test', () => {

    test.beforeEach(async ({ page }) => {
        const startPage = new StartPage(page);
        await startPage.goto();
        await expect(startPage.getHeader).toBeVisible();
    });
  
    const rejectedFactoryValues = [
      '$1', //currency prefix
      '++1', //double plus sign prefix
      '-1', //minus prefix
      '*1', //multiplication prefix
      '&1', //amp prefix
      '/1', //division prefix
      '', //empty
      ' ', //space
      '0', //space
      '-', //minus
      '*', //star
      '#', //star
      '😀4', //Emoji and number
      ];
    for (const factoryValue of rejectedFactoryValues) {
        test(`should successfully modify the Factory value: ${factoryValue}`, async ({ page }) => {
          const startPage = new StartPage(page);
          const gamePage = new GamePage(page);
          const username = "repetitveUnsuccessfulUser"
          const expectedStartPageText = 'Hello '.concat(username);
          await startPage.goto();
          await expect(startPage.getHeader).toBeVisible();
  
          if (await startPage.checkExistingUser(username)) {
            await startPage.selectExistingUser(username);
          } else {
            await startPage.createNewUser(username);
          }
          await expect(gamePage.getHelloText).toContainText(expectedStartPageText);
          const initialFactoryValue = await gamePage.getFactoriesText.innerText()
          const initialMoneyValue = await gamePage.getMoneyText.innerText()
          await gamePage.clickBuyFactoriesButton(factoryValue);
          await expect(gamePage.getFactoriesText).toContainText(initialFactoryValue);
          await expect(gamePage.getMoneyText).toContainText(initialMoneyValue);
        });
    }
  });
  
  test.describe('Repetitive Invalid Factory Test', () => {
  
    test.beforeEach(async ({ page }) => {
        const startPage = new StartPage(page);
        await startPage.goto();
        await expect(startPage.getHeader).toBeVisible();
    });
  
    const invalidFactoryValues = [
      '2+1', // value with addition
      '3*1', // value with multiplication
      '4😀1', // value with emoji
      ' 5😀1', // with prefix space and suffix emoji
      '   6£', // with space prefix and special character suffix
      ];
    for (const factoryValue of invalidFactoryValues) {
        test(`should NOT BE successfully but is using value: ${factoryValue}`, async ({ page }) => {
          const startPage = new StartPage(page);
          const gamePage = new GamePage(page);
          const username = "repetitveInvalidUser"
          const expectedStartPageText = 'Hello '.concat(username);
          await startPage.goto();
          await expect(startPage.getHeader).toBeVisible();
          await startPage.generateUser(username);
          await expect(gamePage.getHelloText).toContainText(expectedStartPageText);
          const initialFactoryValue = await gamePage.getFactoriesText.innerText()
          const initialMoneyValue = await gamePage.getMoneyText.innerText()
          await gamePage.clickBuyFactoriesButton(factoryValue);
          await expect(gamePage.getFactoriesText).not.toContainText(initialFactoryValue);
          await expect(gamePage.getMoneyText).not.toContainText(initialMoneyValue);
        });
    }
  });
  
  test.describe('Repetitive Invalid Cookie Test', () => {
  
    test.beforeEach(async ({ page }) => {
        const startPage = new StartPage(page);
        const gamePage = new GamePage(page);
        const username = "invalidCookieUser"
        const expectedUsername = 'Hello '.concat(username);
        const cookieClicks = 10
        await startPage.goto();
        await expect(startPage.getHeader).toBeVisible();
        await startPage.generateUser(username);
        await expect(gamePage.getHelloText).toContainText(expectedUsername);
        await gamePage.clickCookiesButton(cookieClicks);
    });
  
    const invalidCookieValues = [
      '-1', // negative number
      '2+1', // value with addition
      '3*1', // value with multiplication
      '4😀1', // value with emoji
      ' 5😀1', // with prefix space and suffix emoji
      '   6£', // with space prefix and special character suffix
      ];
      for (const cookieValue of invalidCookieValues) {
        test(`should BE unsuccessful BUT IS successful using value: ${cookieValue}`, async ({ page }) => {
          const gamePage = new GamePage(page);
          const initialCookieValue = await gamePage.getCookiesText.innerText()
          const initialMoneyValue = await gamePage.getMoneyText.innerText()
          await gamePage.clickSellCookiesButton(cookieValue);
          await expect(gamePage.getCookiesText).not.toContainText(initialCookieValue);
          await expect(gamePage.getMoneyText).not.toContainText(initialMoneyValue);
        });
    }
  });
  
  test.describe('Repetitive Valid Cookie Test', () => {
  
    test.beforeEach(async ({ page }) => {
        const startPage = new StartPage(page);
        const gamePage = new GamePage(page);
        const validUsername = "CookieUserValid"
        const expectedValidUsername = 'Hello '.concat(validUsername);
        await startPage.goto();
        await expect(startPage.getHeader).toBeVisible();
        await startPage.generateUser(validUsername);
        await expect(gamePage.getHelloText).toContainText(expectedValidUsername);
    });
  
    const cookieValues = [
      '1', // value
      '', // empty
      ' ', // space
      '£', // special character
      '😀', // emoji
      ];
      for (const cookieValue of cookieValues) {
        test(`should NOT BE successful without Cookie Points using value: ${cookieValue}`, async ({ page }) => {
          const gamePage = new GamePage(page);
          const initialCookieValue = await gamePage.getCookiesText.innerText()
          const initialMoneyValue = await gamePage.getMoneyText.innerText()
          await gamePage.clickSellCookiesButton(cookieValue);
          await expect(gamePage.getCookiesText).toContainText(initialCookieValue);
          await expect(gamePage.getMoneyText).toContainText(initialMoneyValue);
        });
    }
  });