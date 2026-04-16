// src/fixtures/page.fixture.js
import { test as base } from '@playwright/test';
import { createProductPage } from '../pages/productPage.js';

export const pageFixture = base.extend({
  productPage: async ({ page }, use) => {
    const productPage = createProductPage(page);
    await use(productPage);
  },
});