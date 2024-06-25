import { test, expect } from '@playwright/test';
import { StartPage } from '../common/pages/start.page';
import { GamePage } from '../common/pages/game.page';

test.describe('Playwright Automation', () => {

  test.beforeEach(async ({ page }) => {
      const cookiePage = new StartPage(page);
      await cookiePage.goto();
      await expect(cookiePage.getHeader).toBeVisible();
  });

  test.afterEach(async ({}) => {
      // todo
  });

  test('should show the Cookie Clicker page', async ({ page }) => {
    const startPage = new StartPage(page);
    const expectedPageText = 'New Game';
    await expect(startPage.getNewGameText).toContainText(expectedPageText);
  });

  const usernames = [
    'iautomatedUser',
    'iautomatedUser101',
    'iautomatedUser101#!',
    'i88888',
    'i+8',
    ];
  for (const username of usernames) {
      test(`should pass authentication using valid username: ${username}`, async ({ page }) => {
          
          const startPage = new StartPage(page);
          const gamePage = new GamePage(page);
          
          const expectedPageText = 'Hello '.concat(username);
          await startPage.usernameField.fill(username);
          await startPage.clickStartButton();
          await expect(gamePage.getHelloText).toContainText(expectedPageText);
      });
  }

  const wrongUsernames = [
    'i"£$%^&*', //special character with encoding
    'iautomated1234567890123456789012345678901234567890123456789012345678901234567890', //large characters
    '', //empty
    ' ', //space
    '😀', //emoji
    ];
  for (const username of wrongUsernames) {
      test(`should NOT pass authentication but does: ${username}`, async ({ page }) => {
          
          const startPage = new StartPage(page);
          const gamePage = new GamePage(page);
          const encodingText = '£'
          let transformString = username;
          let encodedText = "ï¿½";
          
          if (username.includes(encodingText)) {
            transformString = username.replace(encodingText, encodedText)
          }
          
          const expectedPageText = 'Hello '.concat(transformString);
          await startPage.usernameField.fill(username);
          await startPage.clickStartButton();
          await expect(gamePage.getHelloText).toContainText(expectedPageText);
      });
  }
});