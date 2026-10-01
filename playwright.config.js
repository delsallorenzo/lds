import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    viewport: { width: 1440, height: 900 },
    launchOptions: process.env.LDS_CHROMIUM_PATH ? { executablePath: process.env.LDS_CHROMIUM_PATH } : {},
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run build && npm exec vite -- preview --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: true
  }
})
