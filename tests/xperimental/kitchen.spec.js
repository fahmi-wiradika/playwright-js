import { test, expect } from '@playwright/test';

test('kitchen applitools test', async ({ page}) => {
    await page.goto('https://kitchen.applitools.com/')
    // await page.pause()

    await expect(page.getByText('A pantry full of web')).toHaveCount(1);
    await expect(page).toHaveURL('https://kitchen.applitools.com/');
    await expect(page).toHaveTitle(/.*Kitchen/);
    
    // await page.pause();
    await expect.soft(page).toHaveScreenshot()
    
    if( await page.$('text=The Kitchen')){
        await page.locator('text=The Kitchen').click();
        await expect(page.getByRole('link', { name: 'Alert' })).toBeVisible();
        // await expect.soft(page.getByRole('link', { name: 'API' })).toBeHidden();
        await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
        await expect(page.locator('[id="__next"]')).toMatchAriaSnapshot(`
          - img "Chefs with code ingredients"
          - heading "The Kitchen" [level=1]
          - paragraph: A pantry full of web components that can be used for automated testing.
          - link "Alert":
            - /url: /ingredients/alert
            - heading "Alert" [level=3]
          - link "API":
            - /url: /ingredients/api
            - heading "API" [level=3]
          - link "Canvas":
            - /url: /ingredients/canvas
            - heading "Canvas" [level=3]
          - link "Cookie":
            - /url: /ingredients/cookie
            - heading "Cookie" [level=3]
          - link "Drag & Drop":
            - /url: /ingredients/drag-and-drop
            - heading "Drag & Drop" [level=3]
          - link "File Picker":
            - /url: /ingredients/file-picker
            - heading "File Picker" [level=3]
          - link "iFrame":
            - /url: /ingredients/iframe
            - heading "iFrame" [level=3]
          - link "Links":
            - /url: /ingredients/links
            - heading "Links" [level=3]
          - link "Notification":
            - /url: /ingredients/notification
            - heading "Notification" [level=3]
          - link "Select":
            - /url: /ingredients/select
            - heading "Select" [level=3]
          - link "Table":
            - /url: /ingredients/table
            - heading "Table" [level=3]
          `);
        await expect(page.getByText('A pantry full of web')).toBeVisible();
    }
    
    await expect(page.getByRole('heading', { name: 'The Kitchen' })).toBeVisible();
    // await expect.soft(page.getByRole('heading', { name: 'The Kitchen' })).toBeHidden();



})