# Simple CRUD Apps - Product Management Test Plan

## 1. Scope

### In-Scope Behaviors
- View paginated/scrollable list of existing products with all columns (Index, Product Name, Price, Quantity, ID, Created At, Updated At)
- Add new product with valid data (Product Name, Price, Quantity)
- Update existing product details (Product Name, Price, Quantity)
- Delete existing product from the list
- Form validation and error handling
- Data persistence and accuracy after CRUD operations
- Timestamp integrity (Created At, Updated At)

### Out-of-Scope Behaviors
- Backend API error handling (server-side validation tests)
- Authentication/Authorization
- Pagination/Infinite scroll behavior (if applicable)
- Advanced filtering or search functionality
- Export/Import features
- Bulk operations
- Performance and load testing
- Browser compatibility testing (covered by playwright config)

---

## 2. Risk-Based Matrix

| ID  | Area | Type | Scenario | Priority | Tag |
|-----|------|------|----------|----------|-----|
| P0-1 | Core | UI | View products list on page load | P0 | smoke |
| P0-2 | Add  | UI | Add product with valid data | P0 | smoke |
| P0-3 | Update | UI | Update existing product | P0 | smoke |
| P0-4 | Delete | UI | Delete product from list | P0 | smoke |
| P1-1 | Add | UI | Add product with empty/invalid fields | P1 | regression |
| P1-2 | Add | UI | Add product with special characters in name | P1 | negative |
| P1-3 | Add | UI | Add product with zero or negative price | P1 | negative |
| P1-4 | Add | UI | Add product with zero or negative quantity | P1 | negative |
| P1-5 | Add | UI | Add product with decimal price | P1 | regression |
| P1-6 | Update | UI | Update product with empty fields | P1 | negative |
| P1-7 | Update | UI | Cancel update operation | P1 | regression |
| P1-8 | Delete | UI | Verify product is removed from list after deletion | P1 | regression |
| P1-9 | Delete | UI | Delete multiple products sequentially | P1 | negative |
| P2-1 | Validation | UI | Verify Price input only accepts numbers | P2 | regression |
| P2-2 | Validation | UI | Verify Quantity input only accepts numbers | P2 | regression |
| P2-3 | Data | UI | Verify timestamps update correctly on product update | P2 | regression |
| P2-4 | UI | UI | Verify Add button is disabled with invalid input | P2 | regression |
| P2-5 | UI | UI | Verify form fields clear after successful add | P2 | regression |

---

## 3. Scenario Details

### P0-1: View Products List on Page Load
**Preconditions:**
- Application is accessible at https://simple-crud-apps.vercel.app/
- Backend API has existing products

**Steps:**
1. Navigate to the application home page
2. Wait for page to fully load
3. Verify products table is displayed
4. Verify all products have required columns filled (Index, Product Name, Price, Quantity, ID, Created At, Updated At)
5. Verify each product row has Update and Delete buttons

**Expected Result:**
- Products list displays with at least 1 product
- All column headers are visible
- Action buttons are visible and clickable

**Test Data Needs:**
- N/A (uses existing backend data)

---

### P0-2: Add Product with Valid Data
**Preconditions:**
- Application is accessible
- Products table is visible

**Steps:**
1. Locate the "Add Product" form
2. Enter valid Product Name (e.g., "Test Product")
3. Enter valid Price (e.g., "50000")
4. Enter valid Quantity (e.g., "10")
5. Click the "Add" button
6. Wait for page to update
7. Verify new product appears in the products table

**Expected Result:**
- New product is added to the top/end of the list
- All entered values are correctly displayed
- Timestamp (Created At) is set to current time
- Form fields are cleared for next entry

**Test Data Needs:**
- Product Name: "TestProduct_" + timestamp
- Price: "50000", "12345.50", "999999"
- Quantity: "1", "100", "1000"

---

### P0-3: Update Existing Product
**Preconditions:**
- Application is accessible
- At least one product exists in the table

**Steps:**
1. Click the "Update" button on the first product row
2. Verify update form appears with heading "Update Product"
3. Verify current product name is shown in placeholder
4. Modify Product Name to new value (e.g., "Updated Product Name")
5. Modify Price to new value
6. Modify Quantity to new value
7. Click "Update" button
8. Verify form closes
9. Verify product row is updated with new values

**Expected Result:**
- Update form displays with current product data
- Product is updated with new values in the table
- Updated At timestamp is newer than Created At
- Product ID remains the same

**Test Data Needs:**
- New Name: "Updated_TestProduct_" + timestamp
- New Price: "75000"
- New Quantity: "20"

---

### P0-4: Delete Product from List
**Preconditions:**
- Application is accessible
- At least one product exists in the table

**Steps:**
1. Note the product count before deletion
2. Click the "Delete" button on a product row
3. Wait for deletion to complete
4. Verify product is removed from the list
5. Verify product count decreased by 1

**Expected Result:**
- Product is immediately removed from the table
- Product is no longer visible in the list
- No error messages appear

**Test Data Needs:**
- Use the first product in the list

---

### P1-1: Add Product with Empty Fields
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Leave all fields empty
2. Click "Add" button
3. Observe form behavior

**Expected Result:**
- Add should either be disabled or show validation error
- Product should not be added to the list
- Form should show validation message for required fields

**Test Data Needs:**
- N/A

---

### P1-2: Add Product with Special Characters
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Enter Product Name with special characters (e.g., "Test@#$%Product<>")
2. Enter valid Price
3. Enter valid Quantity
4. Click "Add" button
5. Verify product appears in list with special characters preserved

**Expected Result:**
- Product is successfully added
- Special characters are properly displayed (no escaping issues if applicable)

**Test Data Needs:**
- Product Name: "TestProd@#$%<>_" + timestamp

---

### P1-3: Add Product with Negative Price
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Enter valid Product Name
2. Enter negative Price (e.g., "-5000")
3. Enter valid Quantity
4. Click "Add" button

**Expected Result:**
- Product should not be added if price validation is strict
- Or product is added with negative price (document actual behavior)
- Form either shows error or disables Add button

**Test Data Needs:**
- Price: "-100", "-1", "-999999"

---

### P1-4: Add Product with Zero or Negative Quantity
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Enter valid Product Name
2. Enter valid Price
3. Enter zero or negative Quantity (e.g., "0", "-5")
4. Click "Add" button

**Expected Result:**
- Product is not added if quantity must be positive
- Or product is added with zero/negative quantity (document actual behavior)
- Form shows validation message

**Test Data Needs:**
- Quantity: "0", "-1", "-100"

---

### P1-5: Add Product with Decimal Price
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Enter valid Product Name
2. Enter decimal Price (e.g., "12345.50", "99.99")
3. Enter valid Quantity
4. Click "Add" button

**Expected Result:**
- Product is successfully added
- Price is displayed with proper decimal formatting (refer to existing products for format)

**Test Data Needs:**
- Price: "12345.50", "99.99", "0.50"

---

### P1-6: Update Product with Empty Fields
**Preconditions:**
- Application is accessible
- At least one product exists

**Steps:**
1. Click "Update" button on a product
2. Clear the Product Name field completely
3. Click "Update" button
4. Observe behavior

**Expected Result:**
- Update should not complete if validation is enforced
- Error message should appear
- Product data should remain unchanged

**Test Data Needs:**
- N/A

---

### P1-7: Cancel Update Operation
**Preconditions:**
- Application is accessible
- At least one product exists

**Steps:**
1. Click "Update" button on a product
2. Note the current values
3. Modify Product Name, Price, and Quantity to different values
4. Click "Cancel" button
5. Verify update form closes
6. Verify product values in table remain unchanged

**Expected Result:**
- Update form closes without saving changes
- Product values remain as they were before opening update form
- Form is no longer visible

**Test Data Needs:**
- N/A

---

### P1-8: Verify Product Removal After Deletion
**Preconditions:**
- Application is accessible
- At least one product exists in the table

**Steps:**
1. Find a specific product by name and note its full details
2. Click the "Delete" button for that product
3. Wait for deletion confirmation
4. Search the entire visible list for the product
5. Verify product no longer exists

**Expected Result:**
- Product is not visible anywhere in the list
- No duplicate or partial data remains
- List is properly re-rendered

**Test Data Needs:**
- Use product "Pizza" or another identifiable product

---

### P1-9: Delete Multiple Products Sequentially
**Preconditions:**
- Application is accessible
- At least 3 products exist

**Steps:**
1. Count initial product count
2. Delete first product
3. Verify deletion was successful
4. Delete second product
5. Verify deletion was successful
6. Delete third product
7. Verify all deletions were successful

**Expected Result:**
- Each deletion is successful
- Product count decreases by 1 after each deletion
- No errors occur during sequential operations
- Table remains properly formatted

**Test Data Needs:**
- N/A

---

### P2-1: Price Input Only Accepts Numbers
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Attempt to type letters in Price field (e.g., "abc")
2. Observe field behavior
3. Attempt to type special characters
4. Attempt to enter valid number

**Expected Result:**
- Price field should only accept numeric input
- Non-numeric input is either rejected or stripped
- Valid numbers are accepted

**Test Data Needs:**
- N/A

---

### P2-2: Quantity Input Only Accepts Numbers
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Attempt to type letters in Quantity field (e.g., "xyz")
2. Observe field behavior
3. Attempt to enter valid number

**Expected Result:**
- Quantity field should only accept numeric input
- Non-numeric input is rejected or stripped
- Valid numbers are accepted

**Test Data Needs:**
- N/A

---

### P2-3: Verify Timestamps Update Correctly on Product Update
**Preconditions:**
- Application is accessible
- Product exists with visible timestamps

**Steps:**
1. Note the "Created At" timestamp of a product
2. Note the "Updated At" timestamp
3. Click "Update" button on that product
4. Make a change to any field
5. Click "Update"
6. Verify "Created At" remains unchanged
7. Verify "Updated At" has been updated to a newer timestamp

**Expected Result:**
- Created At remains the same
- Updated At is newer than previous value
- Updated At timestamp is close to current time

**Test Data Needs:**
- N/A

---

### P2-4: Verify Add Button Behavior with Invalid Input
**Preconditions:**
- Application is accessible
- Add Product form is visible

**Steps:**
1. Enter invalid data (empty fields or negative values)
2. Observe "Add" button state
3. Enter valid data
4. Observe "Add" button state

**Expected Result:**
- Add button is either disabled when input is invalid or shows error on click
- Add button is enabled when all inputs are valid
- Add button is clickable only with valid data

**Test Data Needs:**
- Invalid: Empty string, negative numbers
- Valid: "TestProduct", "50000", "10"

---

### P2-5: Verify Form Fields Clear After Successful Add
**Preconditions:**
- Application is accessible
- Add Product form is visible and empty

**Steps:**
1. Enter Product Name: "TestProduct123"
2. Enter Price: "50000"
3. Enter Quantity: "10"
4. Click "Add" button
5. Verify product appears in table
6. Verify Add form fields are cleared and ready for next entry

**Expected Result:**
- After adding product, all form fields are empty
- Product Name placeholder shows "Enter product name"
- Price and Quantity fields are ready for new input
- Form is ready for adding another product

**Test Data Needs:**
- Product Name: "TestProduct_" + timestamp
- Price: "50000"
- Quantity: "10"

---

## 4. Coverage Gaps

### Missing Requirements / Ambiguities
1. **Validation Rules**: Exact validation rules for Product Name (max length? required length? character restrictions?)
2. **Negative Values**: Current behavior with negative price/quantity - is it rejected or allowed?
3. **Decimal Precision**: How many decimal places are supported for price? Rounding behavior?
4. **Duplicate Products**: Can duplicate product names be added?
5. **Large Numbers**: What's the maximum value for Price and Quantity?
6. **Concurrent Operations**: What happens if two users add products simultaneously?
7. **Delete Confirmation**: Is there a confirmation dialog before deletion?
8. **Sorting/Filtering**: Can products be sorted or filtered?
9. **Pagination**: Is there pagination, or do all products load on one page?
10. **Error Messages**: What specific error messages should appear for various validation failures?
11. **API Response Times**: Expected response time for CRUD operations?

### Questions for Product Owner
- Should negative prices/quantities be blocked at the UI level?
- What is the expected behavior for duplicate product names?
- Should there be a confirmation dialog for delete operations?
- What is the maximum character length for Product Name?
- Should prices be validated for minimum/maximum values?

---

## 5. Execution Plan

### Suggested File Targets
- **UI Tests**: `tests/ci/ui/simple-crud.spec.js`
- **Fixtures**: Use existing `src/fixtures/page.fixture.js` for page management

### Priority Execution Order
1. **Phase 1 - Smoke Tests (P0)** - Run first to validate core functionality
   - P0-1: View products list
   - P0-2: Add product
   - P0-3: Update product
   - P0-4: Delete product
   - **Estimated effort**: 4 tests

2. **Phase 2 - Regression Tests (P1)** - Validate edge cases and user flows
   - P1-1 to P1-9: Form validation, error handling, sequential operations
   - **Estimated effort**: 9 tests

3. **Phase 3 - Advanced Tests (P2)** - Input validation, UI state verification
   - P2-1 to P2-5: Input type validation, timestamp verification, button states
   - **Estimated effort**: 5 tests

### Parallelization Hints
- Smoke tests (P0) should run sequentially to avoid test data conflicts
- Regression tests (P1) can run in parallel except P1-9 (sequential deletions)
- Validation tests (P2) can run in parallel as they primarily observe UI behavior

### Recommended Timeouts
- Page load: 5 seconds
- Form submission (Add/Update): 3 seconds
- Product table update after CRUD: 2 seconds
- Delete operation: 2 seconds

### Retry Strategy
- Smoke tests: Retry 1x on failure (network issues)
- Regression tests: Retry 0x (fail fast to catch real bugs)
- Validation tests: Retry 0x (deterministic)

### Test Data Strategy
- Use timestamp-based unique identifiers for test products to avoid conflicts
- Clean up test data after each test run OR rely on test isolation
- Consider using specific product IDs from production data to verify updates/deletes

### Environment Configuration
- Base URL: https://simple-crud-apps.vercel.app/
- Browser: Chromium (as per playwright.config.js default)
- Viewport: Default (1280x720 recommended)

---

## Notes
- This is a UI-focused test plan. No API tests are included, assuming API testing happens separately.
- All tests assume the website is stable and accessible.
- Test execution should be performed in a dedicated test environment or against a test database if available.
- Generated test plan follows Playwright best practices with clear step definitions and acceptance criteria.