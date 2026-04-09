import { test, expect } from '@playwright/test';

let productId, notification, productRow;

test('Verify Page Title and Products API', async ( page ) => {

  await page.goto('https://simple-crud-apps.vercel.app/');
  await expect(page).toHaveTitle('Simple CRUD Apps');
  const productsResponsePromise = page.waitForResponse(
    response => response.url().includes('/api/products') && response.request().method() === 'GET'
  );

  const productsResponse = await productsResponsePromise;
  expect(productsResponse.status()).toBe(200);
  const responseBody = await productsResponse.json();
  expect(Array.isArray(responseBody)).toBeTruthy();

  await page.getByRole('textbox', { name: 'Product Name' }).fill('Sambal Belut');
  await page.getByRole('spinbutton', { name: 'Price' }).fill('7000');
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('4');
  await page.getByRole('button', { name: 'Add' }).click();
  
  // Locate notification and extract Product ID
  notification = page.locator('.notification');
  await expect(notification).toBeVisible();
  const notificationText = await notification.textContent();
  productId = notificationText.match(/Product ID:\s*([a-f0-9]+)/i)[1];
  
  await expect(notification).toBeHidden();

  // Click Update button scoped to the product row by ID
  productRow = page.locator('#productList > div').filter({ hasText: productId });
  await productRow.getByRole('button', { name: 'Update' }).click();
  
  await page.getByPlaceholder('Current: Sambal Belut').fill('Sambal Terasi Segar');
  await page.getByPlaceholder('Current: IDR').fill('5000');
  await page.getByPlaceholder('Current: 4').fill('2');
  await page.locator('.modal-buttons > .btn.btn-update').click();
  
  await expect(notification).toBeVisible();

  await expect(notification).toBeHidden();
  await productRow.getByRole('button', { name: 'Delete' }).click();
  await page.locator('.modal-buttons > .btn.btn-delete').click();

  await expect(notification).toBeVisible();
  await expect(notification).toBeHidden();
  await expect(productRow.getByRole('button', { name: 'Delete' })).toBeHidden();
});