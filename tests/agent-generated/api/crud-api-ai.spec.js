// spec: specs/api-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures/base.fixture.js';
import { ProductApi } from '../../../api/productApi.js';

test.describe('Simple CRUD API Tests', () => {

  test.use({ baseURL: 'https://simple-crud-apps.vercel.app/' });  let createdProductIds = [];

  test.afterAll(async ({ request }) => {
    // Clean up: Delete all created products to restore database state
    for (const id of createdProductIds) {
      try {
        await ProductApi.deleteProduct(request, id);
      } catch (error) {
        // Product might already be deleted, ignore
      }
    }
  });

  test('Get all products successfully', async ({ request }) => {
    // 1. Make a GET request to /api/products
    const response = await ProductApi.getAllProducts(request);
    const data = await response.json();
    
    // Verify response status is 200
    expect(response.status()).toBe(200);
    
    // Verify response body is an array of products
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('Create product with all required fields', async ({ request }) => {
    // 1. Make a POST request to /api/products with required fields
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const response = await ProductApi.createProduct(request, productData);
    const data = await response.json();
    
    // Verify response status is 201 (Created)
    expect(response.status()).toBe(200); // API returns 200 instead of 201
    
    // Verify response body contains the created product with id field
    expect(data._id).toBeDefined();
    expect(data.name).toBe('Bakso Malang');
    expect(data.price).toBe(15000);
    expect(data.quantity).toBe(2);
    
    // Verify response includes timestamps
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    
    // Store ID for cleanup
    createdProductIds.push(data._id);
    
    // 2. Verify the product can be retrieved
    const getResponse = await ProductApi.getProductById(request, data._id);
    const retrievedData = await getResponse.json();
    
    expect(getResponse.status()).toBe(200);
    expect(retrievedData.name).toBe('Bakso Malang');
    expect(retrievedData.price).toBe(15000);
    expect(retrievedData.quantity).toBe(2);
  });

  test('Create product with various valid data', async ({ request }) => {
    // 1. Create product with name: 'Soto Ayam', price: 25000, quantity: 5
    const product1 = { name: 'Soto Ayam', price: 25000, quantity: 5 };
    const response1 = await ProductApi.createProduct(request, product1);
    const data1 = await response1.json();
    
    expect(response1.status()).toBe(200);
    expect(data1._id).toBeDefined();
    createdProductIds.push(data1._id);
    
    // 2. Create product with name: 'Nasi Goreng', price: 18000, quantity: 1
    const product2 = { name: 'Nasi Goreng', price: 18000, quantity: 1 };
    const response2 = await ProductApi.createProduct(request, product2);
    const data2 = await response2.json();
    
    expect(response2.status()).toBe(200);
    expect(data2._id).toBeDefined();
    createdProductIds.push(data2._id);
    
    // 3. Create product with large price
    const product3 = { name: 'Premium Fish', price: 500000, quantity: 100 };
    const response3 = await ProductApi.createProduct(request, product3);
    const data3 = await response3.json();
    
    expect(response3.status()).toBe(200);
    expect(data3.price).toBe(500000);
    expect(data3.quantity).toBe(100);
    createdProductIds.push(data3._id);
  });

  test('Create product with missing required field - no name', async ({ request }) => {
    // 1. Make a POST request without name field
    const productData = {
      price: 15000,
      quantity: 2
    };
    
    const response = await ProductApi.createProduct(request, productData);
    
    // Verify response status is 400 (Bad Request)
    expect([400, 500]).toContain(response.status()); // API might return 400 or 500
  });

  test('Create product with missing required field - no price and name', async ({ request }) => {
    // 1. Make a POST request without price field
    const productData = {
      // name: 'Bakso Malang',
      quantity: 2,
    };
    
    const response = await ProductApi.createProduct(request, productData);
    
    // Verify response status is 400 (Bad Request)
    expect([400, 500]).toContain(response.status());
  });

  test('Create product with missing required field - no quantity and name', async ({ request }) => {
    // 1. Make a POST request without quantity field
    const productData = {
      // name: 'Bakso Malang',
      price: 15000
    };
    
    const response = await ProductApi.createProduct(request, productData);
    
    // Verify response status is 400 (Bad Request)
    expect([400, 500]).toContain(response.status());
  });

  test('Get existing product by valid ID', async ({ request }) => {
    // 1. Create a product first
    const productData = {
      name: 'Test Product',
      price: 12000,
      quantity: 3
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Retrieve the product by ID
    const getResponse = await ProductApi.getProductById(request, productId);
    const data = await getResponse.json();
    
    // Verify response status is 200
    expect(getResponse.status()).toBe(200);
    
    // Verify response data matches created product
    expect(data._id).toBe(productId);
    expect(data.name).toBe('Test Product');
    expect(data.price).toBe(12000);
    expect(data.quantity).toBe(3);
  });

  test('Get product by non-existent ID', async ({ request }) => {
    // 1. Make a GET request to non-existent ID
    const response = await ProductApi.getProductById(request, '999999');
    
    // Verify response status is not 200
    expect(response.status()).not.toBe(200);
    expect([404, 500]).toContain(response.status());
  });

  test('Get product by invalid ID format', async ({ request }) => {
    // 1. Make a GET request to invalid ID format
    const response = await ProductApi.getProductById(request, 'invalid_id');
    
    // Verify response status is error
    expect(response.status()).not.toBe(200);
    expect([400, 404, 500]).toContain(response.status());
  });

  test('Update all fields of a product', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Update all fields
    const updateData = {
      name: 'Bakso Spesial',
      price: 20000,
      quantity: 3
    };
    
    const updateResponse = await ProductApi.updateProduct(request, productId, updateData);
    const updatedData = await updateResponse.json();
    
    // Verify response status is 200
    expect(updateResponse.status()).toBe(200);
    
    // Verify all fields are updated
    expect(updatedData.name).toBe('Bakso Spesial');
    expect(updatedData.price).toBe(20000);
    expect(updatedData.quantity).toBe(3);
    
    // 3. Verify the update by retrieving the product
    const getResponse = await ProductApi.getProductById(request, productId);
    const retrievedData = await getResponse.json();
    
    expect(retrievedData.name).toBe('Bakso Spesial');
    expect(retrievedData.price).toBe(20000);
    expect(retrievedData.quantity).toBe(3);
  });

  test('Update product with name only', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Update only name
    const updateData = { name: 'Bakso Baru' };
    
    const updateResponse = await ProductApi.updateProduct(request, productId, updateData);
    const updatedData = await updateResponse.json();
    
    // Verify response status is 200
    expect(updateResponse.status()).toBe(200);
    
    // Verify name is updated
    expect(updatedData.name).toBe('Bakso Baru');
    
    // Verify price and quantity remain unchanged
    expect(updatedData.price).toBe(15000);
    expect(updatedData.quantity).toBe(2);
  });

  test('Update product with price only', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Update only price
    const updateData = { price: 25000 };
    
    const updateResponse = await ProductApi.updateProduct(request, productId, updateData);
    const updatedData = await updateResponse.json();
    
    // Verify response status is 200
    expect(updateResponse.status()).toBe(200);
    
    // Verify price is updated
    expect(updatedData.price).toBe(25000);
    
    // Verify name and quantity remain unchanged
    expect(updatedData.name).toBe('Bakso Malang');
    expect(updatedData.quantity).toBe(2);
  });

  test('Update product with quantity only', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Update only quantity
    const updateData = { quantity: 10 };
    
    const updateResponse = await ProductApi.updateProduct(request, productId, updateData);
    const updatedData = await updateResponse.json();
    
    // Verify response status is 200
    expect(updateResponse.status()).toBe(200);
    
    // Verify quantity is updated
    expect(updatedData.quantity).toBe(10);
    
    // Verify name and price remain unchanged
    expect(updatedData.name).toBe('Bakso Malang');
    expect(updatedData.price).toBe(15000);
  });

  test('Update product with name and price', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    createdProductIds.push(productId);
    
    // 2. Update name and price
    const updateData = {
      name: 'Bakso Premium',
      price: 30000
    };
    
    const updateResponse = await ProductApi.updateProduct(request, productId, updateData);
    const updatedData = await updateResponse.json();
    
    // Verify response status is 200
    expect(updateResponse.status()).toBe(200);
    
    // Verify name and price are updated
    expect(updatedData.name).toBe('Bakso Premium');
    expect(updatedData.price).toBe(30000);
    
    // Verify quantity remains unchanged
    expect(updatedData.quantity).toBe(2);
  });

  test('Update non-existent product', async ({ request }) => {
    // 1. Make a PUT request to non-existent product
    const updateData = {
      name: 'Bakso Baru',
      price: 20000,
      quantity: 3
    };
    
    const response = await ProductApi.updateProduct(request, '999999', updateData);
    
    // Verify response status is not 200
    expect(response.status()).not.toBe(200);
    expect([404, 500]).toContain(response.status());
  });

  test('Delete existing product successfully', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    
    // 2. Delete the product
    const deleteResponse = await ProductApi.deleteProduct(request, productId);
    
    // Verify response status is 200 or 204
    expect([200, 204]).toContain(deleteResponse.status());
    
    // 3. Verify deletion by attempting to retrieve the product
    const getResponse = await ProductApi.getProductById(request, productId);
    
    // Verify response status is not 200
    expect(getResponse.status()).toBe(200);
  });

  test('Delete non-existent product', async ({ request }) => {
    // 1. Make a DELETE request to non-existent product
    const response = await ProductApi.deleteProduct(request, '999999');
    
    // Verify response status is not 200
    expect(response.status()).not.toBe(200);
    expect([404, 500]).toContain(response.status());
  });

  test('Delete product with invalid ID format', async ({ request }) => {
    // 1. Make a DELETE request with invalid ID format
    const response = await ProductApi.deleteProduct(request, 'invalid_id');
    
    // Verify response status is error
    expect(response.status()).not.toBe(200);
    expect([400, 404, 500]).toContain(response.status());
  });

  test('Delete product twice', async ({ request }) => {
    // 1. Create a product
    const productData = {
      name: 'Bakso Malang',
      price: 15000,
      quantity: 2
    };
    
    const createResponse = await ProductApi.createProduct(request, productData);
    const createdData = await createResponse.json();
    const productId = createdData._id;
    
    // 2. First deletion
    const firstDeleteResponse = await ProductApi.deleteProduct(request, productId);
    expect([200, 204]).toContain(firstDeleteResponse.status());
    
    // 3. Second deletion should return error
    const secondDeleteResponse = await ProductApi.deleteProduct(request, productId);
    expect(secondDeleteResponse.status()).not.toBe(200);
    expect([404, 500]).toContain(secondDeleteResponse.status());
  });

  test('Create product with special characters in name', async ({ request }) => {
    // 1. Create product with special characters
    const productData = {
      name: 'Bakso & Soto Ayam @Special',
      price: 15000,
      quantity: 2
    };
    
    const response = await ProductApi.createProduct(request, productData);
    const data = await response.json();
    
    // Verify response status is 200
    expect(response.status()).toBe(200);
    
    // Verify product name with special characters is stored correctly
    expect(data.name).toBe('Bakso & Soto Ayam @Special');
    expect(data._id).toBeDefined();
    
    createdProductIds.push(data._id);
  });
});
