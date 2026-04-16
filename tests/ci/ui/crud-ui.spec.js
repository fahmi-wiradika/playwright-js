import { test, expect } from '../../../fixtures/base.fixture.js';
import productData from '../../../data/json/singleProduct.json';

test.describe.serial('UI CRUD - Product Management', () => {
  const initialName = productData.name;
  const initialPrice = productData.price;
  const initialQuantity = productData.quantity;
  const updatedName = productData.updatedProduct.Name;
  const updatedPrice = productData.updatedProduct.Price;
  const updatedQuantity = productData.updatedProduct.Quantity;

  let productId = '';

  test.beforeEach('Setup Crud Page', async({ page, productPage }) => {
    await productPage.visit();
  })

  test('Verify Page Title and Products API', async ({ page, productPage }) => {
    // await productPage.visit();
    await expect(page).toHaveTitle('Simple CRUD Apps');
    await productPage.verifyProductListLoaded();
  });

  test('Create Product and Extract Product ID', async ({ productPage }) => {
    // await productPage.visit();
    await productPage.addProduct(initialName, initialPrice, initialQuantity);
    await productPage.verifyNotificationVisible();
    productId = await productPage.getProductIdFromNotification();
    await productPage.waitNotificationToDisappear();
    await productPage.assertProductDetails(productId, {
      id: productId,
      name: initialName,
      price: initialPrice,
      quantity: initialQuantity,
    });
  });

  test('Update Product by ID', async ({ page, productPage }) => {
    // await productPage.visit();
    await productPage.updateProductById(productId, updatedName, updatedPrice, updatedQuantity);
    await productPage.verifyNotificationVisible();
    await productPage.waitNotificationToDisappear();
    await productPage.assertProductDetails(productId, {
      id: productId,
      name: updatedName,
      price: updatedPrice,
      quantity: updatedQuantity,
    });

    const row = page.locator(productPage.selectors.productList).filter({ hasText: productId });
    await expect(row).toBeVisible();
  });

  test('Delete Product by ID', async ({ page, productPage }) => {
    // await productPage.visit();
    await productPage.deleteProductById(productId);
    await productPage.verifyNotificationVisible();
    await productPage.waitNotificationToDisappear();

    const deletedRow = page.locator(productPage.selectors.productList).filter({
      hasText: productId,
    });
    await expect(deletedRow).toHaveCount(0);
  });
});
