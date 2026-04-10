// src/fixtures/base.fixture.js
import { mergeTests } from '@playwright/test';
import { pageFixture } from './page.fixture.js';
import { apiFixture } from './api.fixture.js';

// Single import for all spec files — merge both fixture sets
export const test = mergeTests(pageFixture, apiFixture);
export { expect } from '@playwright/test';