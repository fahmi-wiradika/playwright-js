/**
 * Product API helper for Playwright tests.
 * Usage: pass Playwright's APIRequestContext (`request` fixture).
 */
export class ProductApi {
  static getAllProducts(request) {
    return request.get('/api/products');
  }

  static getProductById(request, id) {
    return request.get(`/api/products/${id}`);
  }

  static createProduct(request, product) {
    return request.post('/api/products', { data: product });
  }

  static updateProduct(request, id, product) {
    return request.put(`/api/products/${id}`, { data: product });
  }

  static deleteProduct(request, id) {
    return request.delete(`/api/products/${id}`);
  }
}
