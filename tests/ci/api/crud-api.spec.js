import { test, expect } from '../../../src/fixtures/base.fixture.js';
import productData from '../../../data/json/singleProduct.json';

test.use({ baseURL: 'https://simple-crud-apps.vercel.app/' });

test.describe.serial('API CRUD - Product Management', () => {
  let productId = '';

  test('should get all products', async ({ productApi }) => {
    const response = await productApi.getAllProducts();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('should create a new product', async ({ productApi }) => {
    const response = await productApi.createProduct({
      name: productData.name,
      quantity: productData.quantity,
      price: productData.price,
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');

    productId = body._id;
    expect(productId).toBeTruthy();
  });

  test('should get a product by id', async ({ productApi }) => {
    const response = await productApi.getProductById(productId);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.name).toBe(productData.name);
    expect(body.quantity).toBe(productData.quantity);
    expect(body.price).toBe(productData.price);
  });

  test('should update a product', async ({ productApi }) => {
    const response = await productApi.updateProduct(productId, {
      quantity: productData.updatedProduct.Quantity,
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.quantity).toBe(productData.updatedProduct.Quantity);
  });

  test('should delete a product by id', async ({ productApi }) => {
    const response = await productApi.deleteProduct(productId);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Product deleted successfully');
  });

  test('should get product by id not found', async ({ productApi }) => {
    const response = await productApi.getProductById(productId);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Product not found');
  });
});
