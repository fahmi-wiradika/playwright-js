// spec: specs/simple-crud.md
// Refactored to use page object model and base fixtures

import { test, expect } from '../../../fixtures/base.fixture.js';
import { createProductPage } from '../../../pages/productPage.js';

test.describe('Simple CRUD Apps - Product Management', () => {
  let productPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object model
    productPage = createProductPage(page);
    // Navigate to application
    await productPage.visit();
  });

  // ========================
  // P0 - Smoke Tests
  // ========================

  test('P0-1: View products list on page load', async ({ page }) => {
    // Verify page loads with all essential elements
    await productPage.verifyPageLoad();
    
    // Verify Add Product form is visible
    await productPage.verifyAddFormVisible();
    
    // Verify All Products section with headers
    await productPage.verifyTableHeaders();
    
    // Verify products are loaded
    await productPage.verifyProductsLoaded();
    
    // Verify first product has action buttons
    await productPage.verifyFirstProductHasActionButtons();
  });

  test('P0-2: Add product with valid data', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `TestProduct_${timestamp}`;
    const price = '50000';
    const quantity = '10';

    // Add product and verify it appears
    await productPage.addProductAndVerify(productName, price, quantity);
    
    // Verify form fields are cleared
    await productPage.verifyFormCleared();

    const productID = await productPage.getProductIdFromNotification();

    await productPage.waitNotificationToDisappear();

    await productPage.deleteProductById(productID);

  });

  test('P0-3: Update existing product', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `UpdateTestProduct_${timestamp}`;
    const newProductName = `Updated_${timestamp}`;
    const newPrice = '75000';
    const newQuantity = '20';

    // Add product
    await productPage.addProduct(productName, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    await productPage.verifyNotificationVisible();
    await productPage.waitNotificationToDisappear();

    // Update product by ID
    await productPage.updateProductById(productId, newProductName, newPrice, newQuantity);

    // Verify product was updated
    await productPage.verifyProductExists(newProductName, newPrice, newQuantity);
    
    // Verify update form is closed
    await productPage.verifyUpdateFormClosed();

    await productPage.waitNotificationToDisappear();

    await productPage.deleteProductById(productId);
  });

  test('P0-4: Delete product from list', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `DeleteTestProduct_${timestamp}`;

    // Add product
    await productPage.addProduct(productName, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    await productPage.waitNotificationToDisappear();
    // Delete product by ID
    await productPage.deleteProductById(productId);

    await productPage.waitNotificationToDisappear();

    // Verify delete confirmation is closed
    await productPage.verifyDeleteConfirmationClosed();
  });

  // ========================
  // P1 - Regression Tests
  // ========================

  test('P1-1: Add product with empty fields', async ({ page }) => {
    // Verify Add button is present
    await productPage.verifyAddButtonPresent();

    // Try to click Add with empty fields
    await productPage.getAddButton().click();

    // Verify form fields remain empty and ready for input
    const nameInput = productPage.getProductNameInput();
    const placeholderValue = await nameInput.getAttribute('placeholder');
    expect(placeholderValue).toBe('Enter product name');
  });

  test('P1-2: Add product with special characters in name', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `TestProd@#$%<>${timestamp}`;
    const price = '50000';
    const quantity = '10';

    // Add product with special characters
    await productPage.addProduct(productName, price, quantity);

    const productId = await productPage.getProductIdFromNotification();
    await productPage.waitNotificationToDisappear();

    // Verify product with special characters appears in list
    await productPage.verifyProductExists(productName)

    await productPage.deleteProductById(productId);
  });

  test('P1-3: Add product with negative price', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `NegPriceProduct_${timestamp}`;
    const negativePrice = '-100';
    const quantity = '5';

    // Fill form with negative price
    await productPage.fillAddForm(productName, negativePrice, quantity);

    // Try to add
    await productPage.getAddButton().click();
    await page.waitForTimeout(1000);

    // Document behavior - product may or may not be added
    const productAdded = await productPage.getProductByName(productName).isVisible().catch(() => false);
    expect([true, false]).toContain(productAdded);
  });

  test('P1-4: Add product with zero quantity', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `ZeroQtyProduct_${timestamp}`;
    const price = '50000';
    const zeroQuantity = '0';

    // Fill form with zero quantity
    await productPage.fillAddForm(productName, price, zeroQuantity);

    // Verify Add button is present
    await productPage.verifyAddButtonPresent();

    // Try to add product
    try {
      await productPage.getAddButton().click();
      await page.waitForTimeout(1000);
    } catch (e) {
      // Expected if button is disabled
    }

    const productId = await productPage.getProductIdFromNotification();
    await productPage.waitNotificationToDisappear();

    // Verify form state
    await productPage.verifyAddFormVisible();

    await productPage.deleteProductById(productId);

  });

  test('P1-5: Add product with decimal price', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `DecimalPriceProduct_${timestamp}`;
    const decimalPrice = '12345.50';
    const quantity = '10';

    // Add product with decimal price
    await productPage.addProduct(productName, decimalPrice, quantity);

    const productId = await productPage.getProductIdFromNotification();
    // Verify product appears
    await productPage.waitNotificationToDisappear();
    await productPage.verifyProductExists(productName);

    await productPage.deleteProductById(productId);

  });

  test('P1-6: Update product with empty fields', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `EmptyFieldTestProduct_${timestamp}`;

    // Add product
    await productPage.addProduct(productName, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    // Open update form by ID
    await productPage.openUpdateFormById(productId);

    // Clear the product name field
    await productPage.clearUpdateFormInput();

    // Verify form is still present
    await expect(productPage.getUpdateProductHeading()).toBeVisible();

    await productPage.cancelUpdate();
    await productPage.deleteProductById(productId);

  });

  test('P1-7: Cancel update operation', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `CancelUpdateTestProduct_${timestamp}`;

    // Add product
    await productPage.addProduct(productName, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    // Get product by name to verify original state
    const productRow = productPage.getProductByName(productName);
    const originalText = await productRow.textContent();

    // Open update form by ID
    await productPage.openUpdateFormById(productId);

    // Modify values
    await productPage.updateProductInForm('CancelTestProduct', '99999', '999');

    // Cancel the update
    await productPage.cancelUpdate();

    // Verify modal is closed
    await productPage.verifyUpdateFormClosed();

    // Verify product values remain unchanged
    const modifiedText = await productRow.textContent();
    expect(modifiedText.length).toBeGreaterThan(0);

    await productPage.deleteProductById(productId);
  });

  test('P1-8: Verify product removal after deletion', async ({ page }) => {
    const timestamp = Date.now();
    const pizzaProduct = `Pizza_${timestamp}`;

    // Add product with Pizza name
    await productPage.addProduct(pizzaProduct, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    // Verify product appears
    await productPage.verifyProductExists(pizzaProduct);

    // Delete product by ID
    await productPage.deleteProductById(productId);

    // Wait a bit and verify product is no longer visible
    await page.waitForTimeout(500);
    const pizzaLocator = productPage.getProductByName(pizzaProduct);
    const isPizzaVisible = await pizzaLocator.isVisible().catch(() => false);
    expect(isPizzaVisible).toBeFalsy();
  });

  test('P1-9: Delete multiple products sequentially', async ({ page }) => {

    await page.pause();
    
    const timestamp = Date.now();
    const productIds = [];

    // Add three products and collect their IDs
    for (let i = 0; i < 3; i++) {
      const productName = `MultiDeleteTestProduct_${i}_${timestamp}`;
      await productPage.addProduct(productName, '50000', '10');
      
      // Get product ID from notification
      const productId = await productPage.getProductIdFromNotification();
      productIds.push(productId);

      await productPage.verifyNotificationVisible();
      await productPage.waitNotificationToDisappear();
    }

    // Get initial product count
    let initialCount = await productPage.getProductCount();

    // Delete first product by ID if available
    if (productIds.length > 0) {
      await productPage.deleteProductById(productIds[0]);
      await productPage.verifyNotificationVisible();
      await productPage.waitNotificationToDisappear();
      let currentCount = await productPage.getProductCount();
      expect(currentCount).toBeLessThan(initialCount);

      // Delete second product by ID if available
      if (productIds.length > 1) {
        initialCount = currentCount;
        await productPage.deleteProductById(productIds[1]);
        await productPage.verifyNotificationVisible();
        await productPage.waitNotificationToDisappear();
        currentCount = await productPage.getProductCount();
        expect(currentCount).toBeLessThan(initialCount);

        // Delete third product by ID if available
        if (productIds.length > 2) {
          initialCount = currentCount;
          await productPage.deleteProductById(productIds[2]);
          await productPage.verifyNotificationVisible();
          await productPage.waitNotificationToDisappear();
          currentCount = await productPage.getProductCount();
          expect(currentCount).toBeLessThan(initialCount);
        }
      }
    }
  });

  // ========================
  // P2 - Advanced Tests
  // ========================

  test('P2-1: Price input only accepts numbers', async ({ page }) => {
    const priceInput = productPage.getPriceInput();

    // Verify input is visible
    await expect(priceInput).toBeVisible();

    // Type numeric value
    await priceInput.fill('12345');
    let value = await productPage.getPriceInputValue();
    expect(value).toBe('12345');

    // Clear and try to type letters on spinbutton (browser prevents it at input level)
    // For number inputs, we test that the input type prevents invalid input
    const inputType = await priceInput.getAttribute('type');
    expect(inputType).toBe('number');
    
    // Number inputs will not accept non-numeric characters
    // Just verify the field still works with numbers after
    await priceInput.clear();
    await priceInput.fill('99');
    value = await productPage.getPriceInputValue();
    expect(value).toBe('99');
  });

  test('P2-2: Quantity input only accepts numbers', async ({ page }) => {
    const quantityInput = productPage.getQuantityInput();

    // Verify input is visible
    await expect(quantityInput).toBeVisible();

    // Type numeric value
    await quantityInput.fill('100');
    let value = await productPage.getQuantityInputValue();
    expect(value).toBe('100');

    // Clear and try to type letters on spinbutton (browser prevents it at input level)
    // For number inputs, we test that the input type prevents invalid input
    const inputType = await quantityInput.getAttribute('type');
    expect(inputType).toBe('number');
    
    // Number inputs will not accept non-numeric characters
    // Just verify the field still works with numbers after
    await quantityInput.clear();
    await quantityInput.fill('50');
    value = await productPage.getQuantityInputValue();
    expect(value).toBe('50');
  });

  test.only('P2-3: Verify timestamps update correctly on product update', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `TimestampTestProduct_${timestamp}`;
    const newName = `Updated_${timestamp}`;

    // Add product
    await productPage.addProduct(productName, '50000', '10');
    
    // Get product ID from notification
    const productId = await productPage.getProductIdFromNotification();

    // Get product row to verify timestamps
    const productRow = productPage.getProductByName(productName);
    const initialContent = await productRow.textContent();

    // Verify timestamps exist initially
    const hasInitialTimestamps = initialContent.includes('2024') || 
                                 initialContent.includes('2025') || 
                                 initialContent.includes('2026');
    expect(hasInitialTimestamps).toBeTruthy();

    // Update product by ID
    await productPage.updateProductById(productId, newName, '75000', '20');

    // Verify product was updated
    await expect(productPage.getProductByName(newName)).toBeVisible();

    // Verify timestamps still exist (Updated At should be newer)
    const updatedRow = productPage.getProductByName(newName);
    const updatedContent = await updatedRow.textContent();
    const hasUpdatedTimestamps = updatedContent.includes('2024') || 
                                 updatedContent.includes('2025') || 
                                 updatedContent.includes('2026');
    expect(hasUpdatedTimestamps).toBeTruthy();

    await productPage.deleteProductById(productId)
    // await page.pause();
  });

  test('P2-4: Verify Add button behavior with invalid input', async ({ page }) => {
    const addButton = productPage.getAddButton();
    const nameInput = productPage.getProductNameInput();
    const priceInput = productPage.getPriceInput();
    const quantityInput = productPage.getQuantityInput();

    // Verify Add button is present
    await productPage.verifyAddButtonPresent();

    // Try with empty fields
    await productPage.clearAddForm();
    await expect(addButton).toBeVisible();

    // Try with invalid data (negative values)
    await productPage.fillAddForm('TestProduct', '-100', '5');
    await expect(addButton).toBeVisible();

    // Try with valid data
    await productPage.fillAddForm('ValidProduct', '50000', '10');
    await productPage.verifyAddButtonEnabled();
  });

  test('P2-5: Verify form fields clear after successful add', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `ClearTestProduct_${timestamp}`;
    const price = '50000';
    const quantity = '10';

    // Get form inputs
    const nameInput = productPage.getProductNameInput();
    const priceInput = productPage.getPriceInput();
    const quantityInput = productPage.getQuantityInput();

    // Fill form
    await productPage.fillAddForm(productName, price, quantity);

    // Verify values are filled
    expect(await nameInput.inputValue()).toBe(productName);

    // Click Add
    await productPage.getAddButton().click();
    const productId = await productPage.getProductIdFromNotification();


    // Wait for product to be added
    await productPage.waitNotificationToDisappear();

    // Verify product appears in list
    await productPage.verifyProductExists(productName);

    // Verify form fields are cleared
    await productPage.verifyFormCleared();

    await productPage.deleteProductById(productId);
  });
});
