// src/fixtures/api.fixtures.js
import { test as base } from '@playwright/test';
import { ProductApi } from '../api/productApi.js';

export const apiFixture = base.extend({
  productApi: async ({ request }, use) => {
    // Bind request once so specs call concise methods.
    const productApi = {
      getAllProducts: () => ProductApi.getAllProducts(request),
      getProductById: (id) => ProductApi.getProductById(request, id),
      createProduct: (product) => ProductApi.createProduct(request, product),
      updateProduct: (id, product) => ProductApi.updateProduct(request, id, product),
      deleteProduct: (id) => ProductApi.deleteProduct(request, id),
    };

    await use(productApi);
  },
});