import { expect, test } from '@playwright/test';

// Tech 一覧・詳細の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// コンテンツは更新され続けるため、特定の Tech 名や件数には依存せず、構造と遷移だけを確かめる

test('Tech 一覧が表示され、現在のタブが Tech になっている', async ({ page }) => {
  await page.goto('/tech');

  await expect(page.getByRole('heading', { level: 1, name: 'Tech' })).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'セクション', exact: true })
      .getByRole('link', { name: 'Tech' }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('section[id^="tech-genre-"]').first()).toBeVisible();
});

test('一覧の Tech から詳細へ移動し、戻るリンクで一覧へ戻れる', async ({ page }) => {
  await page.goto('/tech');
  const row = page.locator('section[id^="tech-genre-"] li a').first();
  const href = await row.getAttribute('href');
  await row.click();

  await expect(page).toHaveURL(href!);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /Works/ })).toBeVisible();

  // 一覧から来たので、戻るボタンは直前のページ（一覧）を指す
  const back = page.locator('[data-back]');
  await expect(back).toHaveText('Tech');
  await back.click();
  await expect(page).toHaveURL('/tech');
});

test('Tech 詳細の関連 Tech から別の Tech 詳細へ移動できる', async ({ page }) => {
  await page.goto('/tech');
  await page.locator('section[id^="tech-genre-"] li a').first().click();

  const related = page
    .locator('section', { has: page.getByRole('heading', { name: 'Related Tech' }) })
    .getByRole('link')
    .first();
  const name = await related.textContent();
  await related.click();

  await expect(page.getByRole('heading', { level: 1, name: name!.trim() })).toBeVisible();
});

test('ジャンルのリンクで、そのジャンルの位置へ移動できる', async ({ page }) => {
  await page.goto('/tech');
  const jump = page.getByRole('navigation', { name: 'ジャンル' }).getByRole('link').last();
  const target = (await jump.getAttribute('href'))!;
  await jump.click();

  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.locator(target)).toBeInViewport();
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('Tech 一覧と詳細の本文が読める', async ({ page }) => {
    await page.goto('/tech');
    const row = page.locator('section[id^="tech-genre-"] li a').first();
    await expect(row).toBeVisible();

    await row.click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Career/ })).toBeVisible();
  });
});
