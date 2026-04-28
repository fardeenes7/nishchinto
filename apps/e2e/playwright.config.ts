import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Config for Mohajon SaaS
 */
export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure"
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }
    ],

    /* Run your local dev server before starting the tests */
    webServer: [
        {
            command: "pnpm --filter web dev",
            port: 3000,
            reuseExistingServer: !process.env.CI
        },
        {
            command: "pnpm --filter storefront dev",
            port: 3001,
            reuseExistingServer: !process.env.CI
        },
        {
            command: "pnpm --filter admin dev",
            port: 3002,
            reuseExistingServer: !process.env.CI
        },
        {
            command: "pnpm --filter dashboard dev",
            port: 3003,
            reuseExistingServer: !process.env.CI
        }
    ]
});
