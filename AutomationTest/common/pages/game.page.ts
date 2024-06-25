import { expect, type Locator, type Page } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly getHelloText: Locator;
  readonly getHomeLink: Locator;
  readonly getCookiesText: Locator;
  readonly getFactoriesText: Locator;
  readonly getMoneyText: Locator;
  readonly addCookieButton: Locator;
  readonly sellCookieButton: Locator;
  readonly buyFactoryButton: Locator;
  readonly sellCookiesField: Locator;
  readonly buyFactoriesField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getHomeLink = page.locator('a', { hasText: 'Cookie Clicker!' });
    this.getHelloText = page.locator('body > p:nth-child(2)');

    this.getCookiesText = page.locator('#cookies');
    this.getFactoriesText = page.locator('#factories');
    this.getMoneyText = page.locator('#money');

    this.sellCookiesField = page.locator('#cookies-to-sell');
    this.buyFactoriesField = page.locator('#factories-to-buy');
    
    this.addCookieButton = page.locator('#click');
    this.sellCookieButton = page.locator('#sell-cookies');
    this.buyFactoryButton = page.locator('#buy-factories');
  }

  async gotoStartPage() {
    await expect(this.getHelloText).toBeVisible();
    await this.getHomeLink.first().click();
  }

  async clickCookiesButton(max){
    await expect(this.getHelloText).toBeVisible();

    for (let step = 0; step < max; step++) {
      await this.addCookieButton.first().click();
    }

    await this.page.waitForTimeout(1000);
  }

  async clickSellCookiesButton(max){
    await expect(this.getHelloText).toBeVisible();
    await this.sellCookiesField.fill(max);
    await this.sellCookieButton.first().click();
  }

  async clickBuyFactoriesButton(max){
    await expect(this.getHelloText).toBeVisible();
    await this.buyFactoriesField.fill(max);
    await this.buyFactoryButton.click();
  }
}