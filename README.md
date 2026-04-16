# Playwright – Web UI + API Test Automation

A test automation repository built with Playwright covering:

- **Web UI testing** with Playwright's built-in browser automation (Chromium, Firefox, WebKit)
- **API testing** with Playwright's `APIRequestContext`

Currently includes suites for **Simple CRUD Apps** (`simple-crud-apps.vercel.app`). Results are published automatically to GitHub Pages via GitHub Actions.

---

## 🚀 Features

### Core Capabilities
- **UI Testing**: Cross-browser automation via Playwright's native browser engine bindings
- **API Testing**: HTTP API validation through Playwright's `APIRequestContext`
- **Headless Execution**: Headless browser mode for CI/CD compatibility (configurable)
- **Page Object Model**: UI interactions encapsulated in a factory-based POM (`pages/productPage.js`)
- **Fixture System**: Modular, composable test fixtures for page and API contexts
- **Data-Driven Testing**: CSV and JSON-based test data via `utils/csv-loader.js`
- **Reporting**: Built-in Playwright HTML report, auto-deployed to GitHub Pages
- **CI/CD Ready**: GitHub Actions integration with automated report deployment
- **AI Agent Support**: Planner, Generator, and Healer agent definitions for automated test authoring and repair

### Advanced Features
- **Fixture Composition**: `mergeTests` pattern combining page and API fixtures into a single import
- **API Verification in UI Tests**: UI actions verified against live API responses (e.g. PUT/DELETE intercept)
- **Video & Trace Recording**: Automatic video and trace capture on first retry
- **Agent-Based Generation**: `.github/agents/` definitions for LLM-assisted test planning, generation, and healing via the Playwright MCP server

---

## 📈 Framework Metrics

| Item | Value |
|---|---|
| Language | JavaScript (CommonJS) |
| Test Runner | `@playwright/test` |
| Browsers | Chromium, Firefox, WebKit |
| Node.js | ≥ 18 (LTS recommended) |
| CI/CD | GitHub Actions |
| Report Hosting | GitHub Pages |

---

## 📁 Project Structure

```
playwright-automation/
├── .github/
│   ├── agents/
│   │   ├── playwright-test-generator.agent.md   # LLM agent: generates tests from plans
│   │   ├── playwright-test-healer.agent.md       # LLM agent: debugs & heals failing tests
│   │   └── playwright-test-planner.agent.md      # LLM agent: creates test plans via browser
│   └── workflows/
│       └── playwright.yml                        # CI/CD: run tests + deploy report to GitHub Pages
├── api/
│   └── productApi.js                             # Static API helper (wraps Playwright request context)
├── data/
│   ├── csv/
│   │   └── list_of_product.csv                   # CSV test data for data-driven UI tests
│   └── json/
│       └── singleProduct.json                    # JSON fixture for single-product CRUD flow
├── fixtures/
│   ├── api.fixture.js                            # API fixture: binds productApi to request context
│   ├── page.fixture.js                           # Page fixture: instantiates productPage POM
│   └── base.fixture.js                           # Merged fixture: single import for all specs
├── pages/
│   └── productPage.js                            # Page Object Model for the CRUD product page
├── prompt/
│   ├── generator.md                              # Prompt for the test generator agent
│   ├── healer.md                                 # Prompt for the test healer agent
│   └── planner.md                                # Prompt for the test planner agent
├── specs/
│   ├── simple-crud-api.md                        # API test plan (human-readable)
│   ├── simple-crud-ui.md                         # UI test plan (human-readable)
│   └── README.md
├── tests/
│   ├── ci/
│   │   ├── api/
│   │   │   └── crud-api.spec.js                  # CI-targeted API CRUD suite
│   │   └── ui/
│   │       └── crud-ui.spec.js                   # CI-targeted UI CRUD suite
│   ├── agent-generated/
│   │   ├── api/
│   │   │   └── crud-api-ai.spec.js               # Expanded API suite (AI-generated)
│   │   └── ui/
│   │       └── crud-ui-ai.spec.js                # Expanded UI suite (AI-generated, P0–P2)
│   ├── xample/
│   │   └── example.spec.js                       # Playwright.dev reference example
│   └── xperimental/
│       ├── crud.spec.js                          # Single-test CRUD sanity check
│       ├── kitchen.spec.js                       # Applitools Kitchen playground spec
│       └── test.spec.js                          # Traced CRUD spec with video recording
├── utils/
│   └── csv-loader.js                             # CSV parser for data-driven tests
├── .vscode/
│   └── mcp.json                                  # VS Code MCP server config (Playwright MCP)
├── package.json
├── package-lock.json
└── playwright.config.js                          # Playwright configuration
```

---

## 🗂️ Directory Overview

| Directory | Purpose |
|---|---|
| `.github/agents/` | LLM agent definitions for AI-assisted test planning, generation, and healing |
| `.github/workflows/` | GitHub Actions pipeline — runs tests on push and deploys the HTML report to GitHub Pages |
| `api/` | Static Playwright API helper methods (GET, POST, PUT, DELETE wrappers) |
| `data/` | Test data files — CSV for data-driven flows, JSON for fixture-based flows |
| `fixtures/` | Composable Playwright fixtures for page objects and API request contexts |
| `pages/` | Page Object Model encapsulating all UI interactions for the product CRUD page |
| `prompt/` | Prompt templates for the Planner, Generator, and Healer agents |
| `specs/` | Human-readable test plans in Markdown (source of truth for test scenarios) |
| `tests/ci/` | Stable, CI-targeted test suites run on every push |
| `tests/agent-generated/` | Expanded test suites authored by the AI generator agent |
| `tests/xperimental/` | Exploratory or sandbox specs — not included in CI runs |
| `utils/` | Shared utility functions (CSV loader, etc.) |

---

## 🧪 Test Coverage

| Module | File | Tags |
|---|---|---|
| API CRUD (CI) | `tests/ci/api/crud-api.spec.js` | smoke, regression |
| UI CRUD (CI) | `tests/ci/ui/crud-ui.spec.js` | smoke, regression, e2e |
| API CRUD (AI-expanded) | `tests/agent-generated/api/crud-api-ai.spec.js` | smoke, regression, negative |
| UI CRUD P0–P2 (AI-expanded) | `tests/agent-generated/ui/crud-ui-ai.spec.js` | smoke, regression, negative |

### Scenario Priority Breakdown (UI)

| Priority | Tag | Description |
|---|---|---|
| P0 | smoke | Core happy-path flows: view, add, update, delete |
| P1 | regression | Edge cases: empty fields, special chars, sequential deletes, cancel |
| P2 | regression | Input validation, timestamp integrity, button state |

---

## 🛠️ Technologies & Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner, assertions, browser automation, and API request context |
| `@types/node` | TypeScript-friendly Node.js type definitions |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js ≥ 18** (LTS recommended; CI uses `node-version: lts/*`)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd playwright-automation
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### 4. Verify Installation

```bash
npx playwright --version
```

---

## ▶️ Running Tests

### Run the Full Suite

```bash
npm run test-all
# or
npx playwright test
```

### Run a Specific Browser Project

```bash
# Chromium only
npm run test-chromium

# Firefox only
npm run test-firefox
```

### Run a Specific Module

```bash
# CI API suite
npx playwright test tests/ci/api

# CI UI suite
npx playwright test tests/ci/ui

# Full CI suite (both API and UI)
npx playwright test tests/ci

# AI-generated API suite
npx playwright test tests/agent-generated/api

# AI-generated UI suite
npx playwright test tests/agent-generated/ui

# Experimental specs
npx playwright test tests/xperimental
```

### Run in Headed Mode (Visible Browser)

```bash
npm run test-ui
# or
npx playwright test tests/ci --headed
```

### Run with Debug Mode

```bash
npm run test-ui-debug
# or
npx playwright test tests/ci/ui --headed --debug
```

### Run a Single Test File

```bash
npx playwright test tests/ci/ui/crud-ui.spec.js
```

### Notes for Simple CRUD Apps suites

- **UI suite state**: `tests/ci/ui/crud-ui.spec.js` runs with `test.describe.serial` — tests share `productId` across the create → update → delete flow. Run the suite as a whole.
- **API suite state**: `tests/ci/api/crud-api.spec.js` also uses `test.describe.serial`. The `productId` captured in the create test is reused by all subsequent tests. Run the suite as a whole.
- **Agent-generated suite**: `tests/agent-generated/ui/crud-ui-ai.spec.js` is self-contained — each test manages its own data lifecycle (create, assert, cleanup).

---

## 📊 Test Reporting

### Playwright Built-in HTML Report

Every test run generates an HTML report in `playwright-report/`:

```bash
# Open the report after a local run
npx playwright show-report
```

The report includes:
- **Pass/fail summary** per test, browser, and project
- **Step-by-step trace viewer** for failed tests (when trace is enabled)
- **Video recordings** on first retry
- **Screenshots** captured on failure

### Trace Viewer

```bash
# View a saved trace file
npm run show-trace
# or
npx playwright show-trace test-results/trace/simple_crud_trace.zip
```

### GitHub Pages Report

The CI pipeline automatically deploys the latest HTML report to GitHub Pages after every push — including runs with failures, so results are always accessible.

Access the live report at:
```
https://<your-username>.github.io/<your-repo-name>/
```

---

## 🔧 Framework Components

### Page Object Model — `pages/productPage.js`

Uses a factory function pattern (`createProductPage(page)`) instead of classes, returning a plain object of action and assertion methods.

| Method Group | Responsibility |
|---|---|
| `visit()` | Navigate to the app and wait for initial product list load |
| `addProduct(name, price, qty)` | Fill and submit the Add Product form |
| `getProductIdFromNotification()` | Extract the generated product ID from the success notification |
| `updateProductById(id, ...)` | Open the update modal, fill fields, submit, and await PUT 200 |
| `deleteProductById(id)` | Click delete, confirm modal, and await DELETE 200 |
| `assertProductDetails(id, expected)` | Assert name, price, quantity fields in the product row |
| `verifyNotificationVisible()` | Assert the notification banner is present |
| `waitNotificationToDisappear()` | Wait for notification to hide before continuing |
| `verifyProduct*` methods | Targeted assertions: form visible, buttons present, product exists, etc. |

### Fixture System — `fixtures/`

| File | Fixture Name | Provides |
|---|---|---|
| `page.fixture.js` | `productPage` | Instantiated `createProductPage(page)` POM |
| `api.fixture.js` | `productApi` | Bound `ProductApi` methods using the test's `request` context |
| `base.fixture.js` | `test`, `expect` | Merged fixture set — single import for all spec files |

Usage in specs:

```js
import { test, expect } from '../../../fixtures/base.fixture.js';

test('example', async ({ productPage, productApi }) => {
  await productPage.visit();
  const response = await productApi.getAllProducts();
  expect(response.status()).toBe(200);
});
```

### API Helper — `api/productApi.js`

Static helper wrapping Playwright's `APIRequestContext`. Accepts `request` as its first argument so it stays stateless and reusable outside the fixture system if needed.

```js
ProductApi.getAllProducts(request)           // GET /api/products
ProductApi.getProductById(request, id)      // GET /api/products/:id
ProductApi.createProduct(request, body)     // POST /api/products
ProductApi.updateProduct(request, id, body) // PUT /api/products/:id
ProductApi.deleteProduct(request, id)       // DELETE /api/products/:id
```

### Data Utilities — `utils/csv-loader.js`

Parses CSV files into an array of row objects keyed by header names. Used for data-driven test scenarios:

```js
import { loadCsv } from '../utils/csv-loader.js';
const rows = loadCsv('data/csv/list_of_product.csv');
// rows[0] → { 'Product Name': 'Mie Ayam', 'Product Price': '10000', ... }
```

---

## 🤖 AI Agent System

Three agent definitions live in `.github/agents/` and use the Playwright MCP server (`npx playwright run-test-mcp-server`) for live browser interaction during test authoring.

### Planner Agent — `playwright-test-planner.agent.md`
Explores the target application via browser tools, maps user flows, and saves a structured Markdown test plan using `planner_save_plan`. Output feeds directly into the Generator.

### Generator Agent — `playwright-test-generator.agent.md`
Consumes a test plan item, executes each step in a real browser via Playwright MCP tools (`browser_click`, `browser_type`, etc.), reads the generated action log, and writes a spec file using `generator_write_test`.

### Healer Agent — `playwright-test-healer.agent.md`
Runs all tests, identifies failures via `test_debug`, inspects the live page state, performs root cause analysis, edits the test file, and re-runs until the suite is green — or marks the test as `test.fixme()` with a comment explaining the observed vs. expected behavior.

### VS Code MCP Integration

The `.vscode/mcp.json` file registers the Playwright MCP server so the agents can be invoked directly from VS Code with MCP-compatible extensions.

---

## ⚙️ Configuration — `playwright.config.js`

Key configuration highlights:

| Setting | Value | Notes |
|---|---|---|
| `testDir` | `./tests` | Root directory for all specs |
| `outputDir` | `./test-results` | Artifacts: traces, videos, screenshots |
| `fullyParallel` | `false` | Sequential by default to avoid shared-state conflicts |
| `retries` | `2` on CI, `0` locally | Retry flaky tests only in CI |
| `workers` | `1` on CI, auto locally | Single worker in CI for deterministic runs |
| `reporter` | `html` | Built-in HTML report |
| `trace` | `on-first-retry` | Trace captured only when a test retries |
| `video` | `on-first-retry` | Video captured only when a test retries |
| `headless` | `true` | Headless by default; override with `--headed` flag |

### Browser Projects

| Project | Browser | Viewport |
|---|---|---|
| `chromium` | Desktop Chrome | 1920 × 1080 |
| `firefox` | Desktop Firefox | 1920 × 1080 |
| `webkit` | Desktop Safari | 1920 × 1080 |

---

## 🔄 CI/CD Pipeline — `.github/workflows/playwright.yml`

The workflow triggers automatically on every push to `main` / `master`.

```
Push
    │
    ▼
┌────────────────────────────────────┐
│  Job 1: test                       │
│  • Setup Node.js (LTS)             │
│  • npm ci                          │
│  • npx playwright install          │
│  • npx playwright test tests/ci    │
│  • Upload playwright-report/       │
│  • Upload test-results/ (traces)   │
│  • Prepare Pages artifact          │
└──────────────┬─────────────────────┘
               │  always (pass or fail)
               ▼
┌────────────────────────────────────┐
│  Job 2: deploy                     │
│  • Deploy to GitHub Pages          │
└────────────────────────────────────┘
```

### One-Time GitHub Repository Setup

1. Go to **Settings → Pages → Source** and select **GitHub Actions**.
2. Go to **Settings → Actions → General → Workflow permissions** and enable **Read and write permissions**.

---

## 🐛 Troubleshooting

### Browser Binaries Not Found
Run the install command to download all required browsers:
```bash
npx playwright install --with-deps
```

### Tests Failing Locally
1. Open `playwright-report/index.html` for a step-by-step breakdown
2. Add `--headed` to watch the browser live: `npx playwright test --headed`
3. Add `--debug` to pause on each step: `npx playwright test --debug`
4. Check trace files under `test-results/` using `npx playwright show-trace`

### Port Already in Use / Network Issues
Tests target the live `simple-crud-apps.vercel.app` deployment. Ensure you have a stable internet connection. There is no local dev server requirement.

### Node.js Version Mismatch
Playwright requires Node.js ≥ 18. Check your version with `node --version` and upgrade if needed. The CI pipeline uses `node-version: lts/*`.

### Serial Tests Running Out of Order
The CI suites (`tests/ci/`) use `test.describe.serial`. Do not run individual tests in isolation — run the full suite so shared state (`productId`) is populated correctly.

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit your changes**: `git commit -m 'Add your feature'`
4. **Push to the branch**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Development Guidelines
- New CI-targeted tests go in `tests/ci/ui/` or `tests/ci/api/`
- Exploratory or in-progress tests go in `tests/xperimental/` (excluded from CI)
- New page interactions belong in `pages/productPage.js`; keep locators inside the `selectors` object
- Avoid `page.waitForTimeout()` — prefer assertion-based waits (`expect(locator).toBeVisible()`)
- Use `fixtures/base.fixture.js` as the single import source in all spec files
- Ensure the full CI suite (`tests/ci`) passes locally before opening a PR
- Update this README if adding new modules or changing the project structure

---

## 📜 npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `test-all` | `npx playwright test` | Run all tests across all projects |
| `test-chromium` | `npx playwright test --project=chromium` | Run all tests in Chromium only |
| `test-firefox` | `npx playwright test --project=firefox` | Run all tests in Firefox only |
| `test-ui` | `npx playwright test example --project=chromium --headed` | Run example spec in headed mode |
| `test-ui-debug` | `npx playwright test tests/xperimental/test.spec.js ... --debug` | Debug experimental spec |
| `show-trace` | `npx playwright show-trace ...` | Open a saved trace file |
| `crud-codegen` | `npx playwright codegen https://simple-crud-apps.vercel.app/` | Launch Playwright codegen recorder |

---

## 🔗 Quick Links

- **Live Test Report**: [https://fahmi-wiradika.github.io/playwright-js/](https://fahmi-wiradika.github.io/playwright-js/)
- **Simple CRUD Apps**: [https://simple-crud-apps.vercel.app](https://simple-crud-apps.vercel.app)
- **Playwright Docs**: [https://playwright.dev](https://playwright.dev)
- **Playwright Test API**: [https://playwright.dev/docs/api/class-test](https://playwright.dev/docs/api/class-test)
- **Playwright MCP Server**: [https://playwright.dev/docs/mcp](https://playwright.dev/docs/mcp)

---

## 📄 License

This project is licensed under the ISC License.

---

**Happy Testing! 🎉**