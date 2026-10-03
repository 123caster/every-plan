import { expect, test } from '@playwright/test';

test('create, open, auto-save and complete a personal task across reloads', async ({ page }) => {
  await page.goto('/today');
  await expect(page.getByRole('heading', { name: '今天', exact: true })).toBeVisible();

  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: '快速创建任务' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: '任务' }).fill('完成 Batch B 回归 今天 19:30 #回归 !高 /25m');
  await expect(dialog.getByText('今天 19:30')).toBeVisible();
  await dialog.getByRole('button', { name: '创建并打开' }).click();

  await expect(page).toHaveURL(/\/today\?task=/);
  const detail = page.getByRole('dialog', { name: '任务详情' });
  await expect(detail).toBeVisible();
  const title = detail.getByRole('textbox', { name: '任务标题' });
  await title.fill('完成 Batch B 回归（已编辑）');
  await expect(detail.getByText('正在保存…')).toBeVisible();
  await expect(detail.getByText('已自动保存')).toBeVisible({ timeout: 5_000 });
  await detail.getByRole('button', { name: '关闭' }).click();

  await page.reload();
  const cardTitle = page.getByText('完成 Batch B 回归（已编辑）');
  await expect(cardTitle).toBeVisible();
  await page.getByRole('button', { name: '完成：完成 Batch B 回归（已编辑）' }).click();
  await expect(page.getByRole('button', { name: '重新打开：完成 Batch B 回归（已编辑）' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: '重新打开：完成 Batch B 回归（已编辑）' })).toBeVisible();
});
