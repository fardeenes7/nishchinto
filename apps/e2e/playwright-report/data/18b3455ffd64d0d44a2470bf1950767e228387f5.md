# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic.test.ts >> dashboard login page loads
- Location: tests/basic.test.ts:8:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Sign in/i)
Expected: visible
Error: strict mode violation: getByText(/Sign in/i) resolved to 2 elements:
    1) <div data-slot="card-description" class="text-sm text-muted-foreground/80">Sign in with your Google account to manage your s…</div> aka getByText('Sign in with your Google')
    2) <button data-slot="button" data-size="default" data-variant="default" class="group/button inline-flex shrink-0 items-center justify-center rounded-4xl border bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invali…>…</button> aka getByRole('button', { name: 'Sign in with Google' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Sign in/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e7]
      - generic [ref=e10]:
        - generic [ref=e11]: Seller Dashboard
        - generic [ref=e12]: Sign in with your Google account to manage your shop
    - generic [ref=e13]:
      - generic [ref=e14]: By signing in, you agree to Nishchinto's Terms of Service and Privacy Policy. All accounts are now open to the public.
      - button "Sign in with Google" [ref=e15]:
        - img
        - text: Sign in with Google
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]: Secure OAuth 2.0
        - generic [ref=e19]: Public Access Live
      - paragraph [ref=e20]: Powered by Nishchinto Cloud Security
  - button "Report Bug" [ref=e21]:
    - img [ref=e22]
  - region "Notifications alt+T"
  - alert [ref=e29]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('landing page loads', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await expect(page).toHaveTitle(/Nishchinto/);
  6  | });
  7  | 
  8  | test('dashboard login page loads', async ({ page }) => {
  9  |   await page.goto('http://localhost:3003/login');
  10 |   await expect(page).toHaveURL(/.*login/);
  11 |   // Check for some text that should be on the login page
> 12 |   await expect(page.getByText(/Sign in/i)).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  13 | });
  14 | 
```