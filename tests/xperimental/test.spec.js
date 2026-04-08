import { test, expect } from '@playwright/test';

test('test', async ({ page, context }) => {

    await context.tracing.start({
    snapshots: true,
    screenshots: true
  })

//   await page.getByRole('textbox', { name: 'Product Name' }).click();
  await page.goto('https://simple-crud-apps.vercel.app/');
  await expect(page).toHaveTitle('Simple CRUD Apps');

  await page.getByRole('textbox', { name: 'Product Name' }).fill('Sambal Belut');
//   await page.getByRole('textbox', { name: 'Product Name' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Price' }).fill('7000');
//   await page.getByRole('spinbutton', { name: 'Price' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('4');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Product ID: ')).toBeVisible();

  await page.getByText('Sambal Belut').isVisible();
  await page.getByRole('button', { name: 'Update' }).first().click();
//   await page.getByPlaceholder('Current: Sambal Belut').click();
  await page.getByPlaceholder('Current: Sambal Belut').fill('Sambal Terasi Segar');
//   await page.getByPlaceholder('Current: IDR').click();
  await page.getByPlaceholder('Current: IDR').fill('5000');
//   await page.getByPlaceholder('Current: 4').click();
  await page.getByPlaceholder('Current: 4').fill('2');
  await page.locator('.modal-buttons > .btn.btn-update').click();
  await page.getByRole('button', { name: 'Delete' }).first().click();
  await page.locator('.modal-buttons > .btn.btn-delete').click();

  await context.tracing.stop({
    path: 'test-results/trace_log/simple_crud_trace.zip'
  })
});