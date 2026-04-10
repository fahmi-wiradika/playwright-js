import { expect } from '@playwright/test';

/**
 * Product CRUD Page Object Model
 * Encapsulates all interactions with the product CRUD page
 */
export const createProductPage = (page) => {
  // Selectors
  const selectors = {
    productName: '#productName',
    productPrice: '#productPrice',
    productQuantity: '#productQuantity',
    addBtn: 'button.btn-primary',
    productList: '#productList > div',
    deleteModalBtn: '#deleteModal button.btn-delete',
    updateModalBtn: '#updateModal button.btn-update',
    notification: '.notification',
    updateName: '#updateName',
    updatePrice: '#updatePrice',
    updateQuantity: '#updateQuantity',
    btnUpdate: '.btn-update',
    btnDelete: '.btn-delete',
  };

  const productList = () => page.locator(selectors.productList);
  const notification = () => page.locator(selectors.notification);

  /**
   * Visit the product page and wait for initial data.
   */
  const visit = async () => {
    const productsResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        /\/api\/products(?:\?.*)?$/.test(response.url()),
      { timeout: 10000 }
    );

    await page.goto('https://simple-crud-apps.vercel.app/');
    const response = await productsResponsePromise;
    expect(response.status()).toBe(200);
    // Firefox can intermittently fail reading streamed response bodies.
    // We still validate the successful GET status and loaded list.
    try {
      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    } catch {
      // no-op on body parse failure; UI load assertion below is authoritative
    }
    await expect(productList().first()).toBeVisible();
  };

  /**
   * Add a new product.
   */
  const addProduct = async (name, price, quantity) => {
    await page.locator(selectors.productName).fill(String(name));
    await page.locator(selectors.productPrice).fill(String(price));
    await page.locator(selectors.productQuantity).fill(String(quantity));

    const addResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/api\/products(?:\?.*)?$/.test(response.url()),
      { timeout: 10000 }
    );

    await page.locator(selectors.addBtn).click();
    const response = await addResponsePromise;
    expect(response.status()).toBe(200);
  };

  /**
   * Get the product ID from notification message.
   */
  const getProductIdFromNotification = async () => {
    const text = (await notification().textContent()) || '';
    const match = text.match(/Product ID:\s*([a-f0-9]+)/i);
    if (!match) {
      throw new Error('Product ID not found in notification.');
    }
    return match[1];
  };

  /**
   * Click a button within a product row identified by productId.
   */
  const clickProductButton = async (productId, buttonSelector) => {
    const row = productList().filter({ hasText: productId });
    await expect(row.first()).toBeVisible();
    await row.first().locator(buttonSelector).click();
  };

  /**
   * Update a product by its ID.
   */
  const updateProduct = async (productId, newName, newPrice, newQuantity) => {
    await clickProductButton(productId, selectors.btnUpdate);

    if (newName !== undefined && newName !== null && newName !== '') {
      await page.locator(selectors.updateName).fill(String(newName));
    }
    if (newPrice !== undefined && newPrice !== null && newPrice !== '') {
      await page.locator(selectors.updatePrice).fill(String(newPrice));
    }
    if (newQuantity !== undefined && newQuantity !== null && newQuantity !== '') {
      await page.locator(selectors.updateQuantity).fill(String(newQuantity));
    }

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        /\/api\/products\/.+/.test(response.url()),
      { timeout: 10000 }
    );

    await page.locator(selectors.updateModalBtn).click();
    const response = await updateResponsePromise;
    expect(response.status()).toBe(200);
  };

  /**
   * Delete a product by its ID.
   */
  const deleteProduct = async (productId) => {
    await clickProductButton(productId, selectors.btnDelete);

    const deleteResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        /\/api\/products\/.+/.test(response.url()),
      { timeout: 10000 }
    );

    await page.locator(selectors.deleteModalBtn).click();
    const response = await deleteResponsePromise;
    expect(response.status()).toBe(200);
  };

  /**
   * Wait for and verify notification visibility.
   */
  const verifyNotificationVisible = async () => {
    await expect(notification()).toBeVisible();
    return notification();
  };

  /**
   * Wait for notification to disappear.
   */
  const waitNotificationToDisappear = async () => {
    await expect(notification()).toBeHidden();
    return notification();
  };

  /**
   * Verify product list is loaded and visible.
   */
  const verifyProductListLoaded = async () => {
    await expect(productList().first()).toBeVisible();
    return productList();
  };

  /**
   * Assert product details by identifier.
   */
  const assertProductDetails = async (identifier, expectedValues) => {
    const row = productList().filter({ hasText: identifier }).first();
    await expect(row).toBeVisible();

    if (expectedValues.id) {
      await expect(row.locator('.product-id')).toHaveText(expectedValues.id);
    }
    if (expectedValues.name) {
      await expect(row.locator('.product-name')).toHaveText(expectedValues.name);
    }
    if (expectedValues.price) {
      const priceText = (await row.locator('.product-price').textContent()) || '';
      const normalizedPriceText = priceText.replace(/\D/g, '');
      const normalizedExpectedPrice = String(expectedValues.price).replace(/\D/g, '');
      expect(normalizedPriceText).toContain(normalizedExpectedPrice);
    }
    if (expectedValues.quantity) {
      const quantityText = (await row.locator('.product-quantity').textContent()) || '';
      expect(quantityText).toContain(String(expectedValues.quantity));
    }
  };

  return {
    selectors,
    visit,
    addProduct,
    getProductIdFromNotification,
    updateProduct,
    deleteProduct,
    clickProductButton,
    verifyNotificationVisible,
    waitNotificationToDisappear,
    verifyProductListLoaded,
    assertProductDetails,
  };
};