import { defineConfig, devices } from '@playwright/test'
import path from 'path'

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        // We can define a storage state for authentication bypass
        // storageState: 'e2e/.auth/storageState.json',
    },

    projects: [
        // Global setup to run before all tests
        // { name: 'setup', testMatch: /.*\.setup\.ts/ },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use prepared auth state
                // storageState: 'e2e/.auth/storageState.json'
            },
            // dependencies: ['setup'],
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                // storageState: 'e2e/.auth/storageState.json' 
            },
            // dependencies: ['setup'],
        },
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5'],
                // storageState: 'e2e/.auth/storageState.json'  
            },
            // dependencies: ['setup'],
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
})
