# Simple CRUD API Test Plan

## Application Overview

Comprehensive API test plan for Simple CRUD Apps (https://simple-crud-apps.vercel.app/). This plan covers all CRUD operations for product management: getting all products, creating new products, retrieving products by ID, updating products with full or partial data, and deleting products. The test plan includes happy path scenarios, edge cases, validation testing, and error handling scenarios.

## Test Scenarios

### 1. Get All Products

**Seed:** `tests/seed.spec.ts`

#### 1.1. Get all products successfully

**File:** `tests/api/crud-api-get-all.spec.js`

**Steps:**
  1. Make a GET request to /api/products
    - expect: Response status code is 200
    - expect: Response body is an array of products
    - expect: Each product object contains id, name, price, quantity, createdAt, and updatedAt fields
  2. Verify the returned products have valid data types
    - expect: name is a string
    - expect: price is a number
    - expect: quantity is a number
    - expect: id is present (string or number)

#### 1.2. Get all products when list is empty

**File:** `tests/api/crud-api-get-all-empty.spec.js`

**Steps:**
  1. Clear all products from the database (delete all existing products)
    - expect: All products are successfully deleted
  2. Make a GET request to /api/products
    - expect: Response status code is 200
    - expect: Response body is an empty array []

#### 1.3. Get all products with multiple items

**File:** `tests/api/crud-api-get-all-multiple.spec.js`

**Steps:**
  1. Create 5 different products with various data
    - expect: All 5 products are created successfully with status 201
  2. Make a GET request to /api/products
    - expect: Response status code is 200
    - expect: Response body contains exactly 5 products
    - expect: All created products are present in the response

### 2. Create Product (Add Product)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Create product with all required fields

**File:** `tests/api/crud-api-create-required.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Response status code is 201 (Created)
    - expect: Response body contains the created product with id field
    - expect: Returned product has name: 'Bakso Malang', price: 15000, quantity: 2
    - expect: Response includes createdAt and updatedAt timestamps
  2. Verify the product can be retrieved by making a GET request to /api/products/{id}
    - expect: Response status code is 200
    - expect: Retrieved product matches the sent data

#### 2.2. Create product with various valid data

**File:** `tests/api/crud-api-create-valid-data.spec.js`

**Steps:**
  1. Create product with name: 'Soto Ayam', price: 25000, quantity: 5
    - expect: Response status code is 201
    - expect: Product is created successfully
  2. Create product with name: 'Nasi Goreng', price: 18000, quantity: 1
    - expect: Response status code is 201
    - expect: Product is created successfully
  3. Create product with large price: 'Premium Fish', price: 500000, quantity: 100
    - expect: Response status code is 201
    - expect: Product handles large numbers correctly

#### 2.3. Create product with missing required field - no name

**File:** `tests/api/crud-api-create-missing-name.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"price": 15000, "quantity": 2} (missing name)
    - expect: Response status code is 400 (Bad Request)
    - expect: Response contains error message indicating 'name' field is required

#### 2.4. Create product with missing required field - no price

**File:** `tests/api/crud-api-create-missing-price.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "Bakso Malang", "quantity": 2} (missing price)
    - expect: Response status code is 400 (Bad Request)
    - expect: Response contains error message indicating 'price' field is required

#### 2.5. Create product with missing required field - no quantity

**File:** `tests/api/crud-api-create-missing-quantity.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "Bakso Malang", "price": 15000} (missing quantity)
    - expect: Response status code is 400 (Bad Request)
    - expect: Response contains error message indicating 'quantity' field is required

#### 2.6. Create product with invalid data types

**File:** `tests/api/crud-api-create-invalid-types.spec.js`

**Steps:**
  1. Make a POST request with price as string: {"name": "Bakso", "price": "15000", "quantity": 2}
    - expect: Response either coerces price to number or returns 400 error
  2. Make a POST request with quantity as string: {"name": "Bakso", "price": 15000, "quantity": "2"}
    - expect: Response either coerces quantity to number or returns 400 error

#### 2.7. Create product with empty name

**File:** `tests/api/crud-api-create-empty-name.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "", "price": 15000, "quantity": 2}
    - expect: Response status code is 400 (Bad Request)
    - expect: Response contains error message about empty name

#### 2.8. Create product with negative price

**File:** `tests/api/crud-api-create-negative-price.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "Bakso", "price": -15000, "quantity": 2}
    - expect: Response either rejects with 400 error or allows negative price (depends on business logic)

#### 2.9. Create product with zero quantity

**File:** `tests/api/crud-api-create-zero-quantity.spec.js`

**Steps:**
  1. Make a POST request to /api/products with body: {"name": "Bakso", "price": 15000, "quantity": 0}
    - expect: Response status code is 201 (allows zero quantity) or 400 (rejects zero quantity)

#### 2.10. Create product with special characters in name

**File:** `tests/api/crud-api-create-special-chars.spec.js`

**Steps:**
  1. Make a POST request with special characters: {"name": "Bakso & Soto Ayam @Special", "price": 15000, "quantity": 2}
    - expect: Response status code is 201
    - expect: Product name is stored correctly with special characters

### 3. Get Product by ID

**Seed:** `tests/seed.spec.ts`

#### 3.1. Get existing product by valid ID

**File:** `tests/api/crud-api-get-by-id.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created with status 201 and id is returned
  2. Make a GET request to /api/products/{id} using the returned id
    - expect: Response status code is 200
    - expect: Response body contains the exact product that was created

#### 3.2. Get product by non-existent ID

**File:** `tests/api/crud-api-get-by-id-not-found.spec.js`

**Steps:**
  1. Make a GET request to /api/products/999999 (assuming this ID doesn't exist)
    - expect: Response status code is 404 (Not Found)
    - expect: Response body contains error message like 'Product not found' or similar

#### 3.3. Get product by invalid ID format

**File:** `tests/api/crud-api-get-by-id-invalid-format.spec.js`

**Steps:**
  1. Make a GET request to /api/products/invalid_id
    - expect: Response status code is 400 (Bad Request) or 404
    - expect: Response contains appropriate error message

#### 3.4. Get product by ID after deletion

**File:** `tests/api/crud-api-get-deleted-product.spec.js`

**Steps:**
  1. Create a product and get its ID
    - expect: Product created successfully
  2. Delete the product using DELETE /api/products/{id}
    - expect: Product is deleted with status 200 or 204
  3. Make a GET request to /api/products/{id} for the deleted product
    - expect: Response status code is 404 (Not Found)

### 4. Update Product by ID

**Seed:** `tests/seed.spec.ts`

#### 4.1. Update all fields of a product

**File:** `tests/api/crud-api-update-all-fields.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully with an id
  2. Make a PUT request to /api/products/{id} with body: {"name": "Bakso Spesial", "price": 20000, "quantity": 3}
    - expect: Response status code is 200 (OK)
    - expect: Response contains updated product with all new values
    - expect: name: 'Bakso Spesial', price: 20000, quantity: 3
  3. Verify the update by making a GET request to /api/products/{id}
    - expect: Retrieved product shows all updated values

#### 4.2. Update product with name only

**File:** `tests/api/crud-api-update-name-only.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"name": "Bakso Baru"}
    - expect: Response status code is 200
    - expect: name is updated to 'Bakso Baru'
    - expect: price and quantity remain unchanged at 15000 and 2

#### 4.3. Update product with price only

**File:** `tests/api/crud-api-update-price-only.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"price": 25000}
    - expect: Response status code is 200
    - expect: price is updated to 25000
    - expect: name and quantity remain unchanged

#### 4.4. Update product with quantity only

**File:** `tests/api/crud-api-update-quantity-only.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"quantity": 10}
    - expect: Response status code is 200
    - expect: quantity is updated to 10
    - expect: name and price remain unchanged

#### 4.5. Update product with name and price

**File:** `tests/api/crud-api-update-name-price.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"name": "Bakso Premium", "price": 30000}
    - expect: Response status code is 200
    - expect: name and price are updated
    - expect: quantity remains unchanged at 2

#### 4.6. Update non-existent product

**File:** `tests/api/crud-api-update-not-found.spec.js`

**Steps:**
  1. Make a PUT request to /api/products/999999 with body: {"name": "Bakso Baru", "price": 20000, "quantity": 3}
    - expect: Response status code is 404 (Not Found)
    - expect: Response contains error message about product not found

#### 4.7. Update product with empty name

**File:** `tests/api/crud-api-update-empty-name.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"name": ""}
    - expect: Response either rejects with 400 error or allows empty name (depends on validation)

#### 4.8. Update product with negative price

**File:** `tests/api/crud-api-update-negative-price.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"price": -5000}
    - expect: Response either allows it or returns 400 error (depends on validation)

#### 4.9. Update product with empty body

**File:** `tests/api/crud-api-update-empty-body.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with empty body: {}
    - expect: Response status code is 200 and product remains unchanged, or returns 400 error

#### 4.10. Update product with extra fields

**File:** `tests/api/crud-api-update-extra-fields.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a PUT request to /api/products/{id} with body: {"name": "Bakso Baru", "price": 20000, "category": "Food", "description": "Delicious"}
    - expect: Response either ignores extra fields and updates only name/price, or returns error

### 5. Delete Product by ID

**Seed:** `tests/seed.spec.ts`

#### 5.1. Delete existing product successfully

**File:** `tests/api/crud-api-delete-success.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully with an id
  2. Make a DELETE request to /api/products/{id}
    - expect: Response status code is 200 (OK) or 204 (No Content)
    - expect: Response body indicates product was deleted successfully
  3. Verify deletion by making a GET request to /api/products/{id}
    - expect: Response status code is 404 (Not Found)

#### 5.2. Delete non-existent product

**File:** `tests/api/crud-api-delete-not-found.spec.js`

**Steps:**
  1. Make a DELETE request to /api/products/999999 (assuming this ID doesn't exist)
    - expect: Response status code is 404 (Not Found)
    - expect: Response contains error message about product not found

#### 5.3. Delete product with invalid ID format

**File:** `tests/api/crud-api-delete-invalid-format.spec.js`

**Steps:**
  1. Make a DELETE request to /api/products/invalid_id
    - expect: Response status code is 400 (Bad Request) or 404
    - expect: Response contains appropriate error message

#### 5.4. Delete product twice

**File:** `tests/api/crud-api-delete-twice.spec.js`

**Steps:**
  1. Create a product: {"name": "Bakso Malang", "price": 15000, "quantity": 2}
    - expect: Product is created successfully
  2. Make a DELETE request to /api/products/{id}
    - expect: First deletion returns status code 200 or 204
  3. Make a second DELETE request to /api/products/{id}
    - expect: Second deletion returns 404 (Not Found) since product no longer exists

#### 5.5. Delete product and verify it's removed from all products list

**File:** `tests/api/crud-api-delete-verify-list.spec.js`

**Steps:**
  1. Create 3 products
    - expect: All products created successfully
  2. Get all products and count them
    - expect: Total count is 3
  3. Delete one product by ID
    - expect: Product deleted with status 200 or 204
  4. Get all products again and count them
    - expect: Total count is now 2
    - expect: The deleted product is not in the list
