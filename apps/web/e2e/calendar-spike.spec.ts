import { expect, test } from '@playwright/test';

test('130% text remains readable and the calendar supports keyboard and drag movement', async ({ page }) => {
  await page.goto('/settings/appearance');
  await page.getByRole('button', { name: '大字 130%' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-font-scale', '130');

  await page.getByRole('button', { name: '周日历' }).first().click();
  const task = page.getByRole('button', { name: /插件 API 评审/ });
  await expect(task).toBeVisible();
  const box = await task.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(72);

  await task.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('当前：周三，10:00，60 分钟')).toBeVisible();

  const targetDay = page.getByTestId('calendar-day-3');
  await targetDay.scrollIntoViewIfNeeded();
  const sourceBox = await task.boundingBox();
  const targetBox = await targetDay.boundingBox();
  expect(sourceBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + 140, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByText('当前：周四，10:00，60 分钟')).toBeVisible();

  await page.getByRole('button', { name: '完整周' }).click();
  await expect(page.getByText('周日', { exact: true })).toBeVisible();
});

test('reduced motion keeps the core controls available', async ({ page }) => {
  await page.goto('/settings/appearance');
  await page.getByRole('button', { name: '减少' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.getByRole('button', { name: '周日历' }).first()).toBeVisible();
});
