import { expect, test } from '@playwright/test';

// Activity 一覧の表示と絞り込み（.claude/rules/testing.md の E2E の範囲）。
// Activity は毎日自動で増えるため、件数や作品名には依存しない。まだ1件もない場合は、表示だけを確かめる

const items = '[data-activity-item]';

test('Activity 一覧が表示され、現在のタブが Activity になっている', async ({ page }) => {
  await page.goto('/activity');

  await expect(page.getByRole('heading', { level: 1, name: 'Activity' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link', {
      name: 'Activity',
    }),
  ).toHaveAttribute('aria-current', 'page');
});

test('作品で絞り込むと URL が変わり、履歴には積まれない', async ({ page }) => {
  await page.goto('/activity');
  test.skip((await page.locator(items).count()) === 0, 'Activity がまだない');

  const filters = page.getByRole('navigation', { name: '作品で絞り込む' });
  const work = filters.getByRole('link').nth(1);
  const workId = (await work.getAttribute('data-activity-filter'))!;
  const historyLength = await page.evaluate(() => history.length);
  await work.click();

  await expect(page).toHaveURL(`/activity?work=${workId}`);
  await expect(work).toHaveAttribute('aria-current', 'true');
  await expect(page.locator(`${items}:visible`).first()).toHaveAttribute('data-work', workId);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);

  await filters.getByRole('link', { name: 'All' }).click();
  await expect(page).toHaveURL('/activity');
});

test('?work= で開くと、その作品で絞り込んだ状態で表示される', async ({ page }) => {
  await page.goto('/activity');
  const first = page.locator(items).first();
  test.skip((await first.count()) === 0, 'Activity がまだない');

  const workId = (await first.getAttribute('data-work'))!;
  await page.goto(`/activity?work=${workId}`);
  for (const item of await page.locator(`${items}:visible`).all()) {
    await expect(item).toHaveAttribute('data-work', workId);
  }
});

test('Activity の作品名から作品詳細へ移動できる', async ({ page }) => {
  await page.goto('/activity');
  const link = page.locator(`${items} a[href^="/works/"]`).first();
  test.skip((await link.count()) === 0, 'Activity がまだない');

  const title = (await link.textContent())!.trim();
  await link.click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('絞り込みを出さずに、すべての Activity を表示する', async ({ page }) => {
    await page.goto('/activity');
    await expect(page.getByRole('heading', { level: 1, name: 'Activity' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: '作品で絞り込む' })).toBeHidden();
    const count = await page.locator(items).count();
    await expect(page.locator(`${items}:visible`)).toHaveCount(count);
  });
});
