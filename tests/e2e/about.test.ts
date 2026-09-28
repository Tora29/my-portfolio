import { expect, test } from '@playwright/test';

// About の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// プロフィールの文面には依存せず、構造と遷移だけを確かめる

test('プロフィールが表示され、現在のタブが About になっている', async ({ page }) => {
  await page.goto('/about');

  await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link', {
      name: 'About',
    }),
  ).toHaveAttribute('aria-current', 'page');
  for (const name of ['Strengths', 'Values', 'Next']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});

test('Strengths の Tech タグから Tech 詳細へ移動できる', async ({ page }) => {
  await page.goto('/about');
  const tag = page.locator('main a[href^="/tech/"]:visible').first();
  const name = (await tag.textContent())!.trim();
  await tag.click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
});

test('すべてのタブのページが表示できる', async ({ page }) => {
  await page.goto('/about');
  const tabs = page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link');
  const hrefs = await tabs.evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
  // Notes・Activity は後のフェーズで作る
  for (const href of hrefs.filter((h) => !['/notes', '/activity'].includes(h))) {
    const response = await page.goto(href);
    expect(response?.status(), href).toBe(200);
  }
});
