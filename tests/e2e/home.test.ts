import { expect, test } from '@playwright/test';

// Home の入口（.claude/rules/testing.md の E2E の範囲）。演出（Canvas）はテストしない

const SECTIONS = ['/about', '/career', '/works', '/tech', '/notes', '/activity'];

test('名前から About へ移動できる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).click();
  await expect(page).toHaveURL('/about');
});

test('惑星から各セクションへ移動できる', async ({ page }) => {
  await page.goto('/');
  const planets = page.getByRole('navigation', { name: 'セクション' });
  for (const name of ['Career', 'Works', 'Tech', 'Notes']) {
    await planets.getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await page.getByRole('link', { name: '閉じて Home に戻る' }).click();
    await expect(page).toHaveURL('/');
  }
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('すべてのセクションへのリンクがある', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    // Activity は、まだ1件もないときは右下に出ないため、Activity があるときだけ確かめる
    const expected = hrefs.includes('/activity')
      ? SECTIONS
      : SECTIONS.filter((s) => s !== '/activity');
    for (const href of expected) expect(hrefs).toContain(href);
  });
});
