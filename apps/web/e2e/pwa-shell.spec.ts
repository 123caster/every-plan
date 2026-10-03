import { expect, test } from '@playwright/test';

test('manifest and service worker provide an offline-reloadable app shell', async ({ context, page }) => {
  await page.goto('/today');
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toBe('/manifest.webmanifest');
  await expect.poll(async () => page.evaluate(async () => Boolean(await navigator.serviceWorker.ready))).toBe(true);
  await page.reload();
  await expect(page.getByRole('main').getByRole('heading', { name: '今天', exact: true })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('main').getByRole('heading', { name: '今天', exact: true })).toBeVisible();
  await context.setOffline(false);
});
