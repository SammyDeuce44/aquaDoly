import { expect, type Locator, type Page } from '@playwright/test';
import ENV from "../utils/env"

export class StartPage {
  readonly page: Page;
  readonly getHeader: Locator;
  readonly getNewGameText: Locator;
  readonly usernameField: Locator;
  readonly startButton: Locator;
  readonly highScoresTableRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getHeader = page.locator('h1', { hasText: 'Cookie Clicker!' });
    this.usernameField = page.locator('body form input')
    this.startButton = page.getByRole('button', { name: 'Start!' });
    this.highScoresTableRow = page.locator('table tbody tr');
    this.getNewGameText = page.locator('h2', { hasText: 'New Game' });
  }

  async goto() {
    await this.page.goto(ENV.URL);
    await expect(this.getHeader).toBeVisible();
  }

  async verifyPage() {
    await expect(this.getHeader).toBeVisible();
  }

  async clickStartButton() {
    await expect(this.getHeader).toBeVisible();
    await this.startButton.click();
  }

  async generateUser(username) {
    if (await this.checkExistingUser(username)) {
      await this.selectExistingUser(username);
    } else {
      await this.createNewUser(username);
    }
  }

  async createNewUser(username) {
    await expect(this.getHeader).toBeVisible();
    await this.usernameField.fill(username);
    await this.clickStartButton();
  }

  async checkExistingUser(username) {
    const uniqueLink = this.page.locator('a', { hasText: username }).first();
    if(await uniqueLink.isVisible()) {
      return true
    } else {
        return false
    }
  }

  async selectExistingUser(username) {
    const uniqueLink = this.page.getByRole('link', { name: username }).first();
    await expect(uniqueLink).toBeVisible();
    await uniqueLink.click();
  }

  async getHighScore(username){
    let highScore;
    const rowCount = await this.highScoresTableRow.count();
    for (let i = 0; i < rowCount; i++) {
      const currentRow = this.highScoresTableRow.nth(i)
      const uniqueRowName = currentRow.locator('td:nth-child(1)').locator('a', { hasText: username })
      const uniqueRowScore = currentRow.locator('td:nth-child(2)')
      if (await uniqueRowName.isVisible()) {
        highScore = await uniqueRowScore.innerHTML()
      }
    }
    return highScore
  }
}