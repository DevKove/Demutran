import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/qa',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: [['list'], ['html', { outputFolder: 'qa-report', open: 'never' }]],
  use: {
    baseURL: process.env.DEMUTRAN_QA_URL || 'https://devkove.github.io/Demutran/',
    browserName: 'chromium',
    headless: process.env.QA_HEADLESS !== 'false',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
