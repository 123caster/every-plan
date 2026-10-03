import { expect, test } from '@playwright/test';

test('manifest and service worker provide an offline-reloadable app shell', async ({ context, page }) => {
  await page.goto('/');
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toBe('/manifest.webmanifest');
  await expect.poll(async () => page.evaluate(async () => Boolean(await navigator.serviceWorker.ready))).toBe(true);
  await page.reload();
  await expect(page.getByText('一个安静、清晰、可扩展的个人计划空间')).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('一个安静、清晰、可扩展的个人计划空间')).toBeVisible();
  await context.setOffline(false);
});

