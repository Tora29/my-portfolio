import { expect, test } from '@playwright/test';

// 作品一覧・詳細の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// コンテンツは更新され続けるため、特定の作品名や件数には依存せず、構造と遷移だけを確かめる

const workLinks = 'main li a[href^="/works/"]';

test('作品一覧が表示され、現在のタブが Works になっている', async ({ page }) => {
  await page.goto('/works');

  await expect(page.getByRole('heading', { level: 1, name: 'Works' })).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'セクション', exact: true })
      .getByRole('link', { name: 'Works' }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.locator(workLinks).first()).toBeVisible();
});

test('作品詳細 → Tech 詳細 → 作品詳細 と往復できる', async ({ page }) => {
  await page.goto('/works');
  const work = page.locator(workLinks).first();
  const title = (await work.locator('h2').textContent())!.trim();
  await work.click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

  // 作品の Tech タグから Tech 詳細へ
  const tag = page
    .locator('section', { has: page.getByRole('heading', { name: 'Tech', exact: true }) })
    .locator('a[href^="/tech/"]:visible')
    .first();
  const techName = (await tag.textContent())!.trim();
  await tag.click();
  await expect(page.getByRole('heading', { level: 1, name: techName })).toBeVisible();

  // Tech 詳細の Works から作品詳細へ戻れる
  await page.locator('[data-back-scope] a[href^="/works/"]', { hasText: title }).click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
});

test('戻るボタンは直前のページへ戻り、URL を直接開いたときは一覧へ戻る', async ({ page }) => {
  await page.goto('/works');
  const work = page.locator(workLinks).first();
  const workHref = (await work.getAttribute('href'))!;
  const title = (await work.locator('h2').textContent())!.trim();
  await work.click();

  await page.locator('[data-back-scope] a[href^="/tech/"]:visible').first().click();
  const back = page.locator('[data-back]');
  await expect(back).toHaveText(title);
  await back.click();
  await expect(page).toHaveURL(workHref);

  // 作品詳細に戻ったので、次の戻り先はその前の一覧
  await expect(back).toHaveText('Works');

  // 直接開いたときは所属する一覧へ
  await page.goto(workHref);
  await expect(back).toHaveText('All Works');
  await expect(back).toHaveAttribute('href', '/works');
});

test('タブで移動したページには戻るボタンを出さない', async ({ page }) => {
  await page.goto('/works');
  await page
    .getByRole('navigation', { name: 'セクション', exact: true })
    .getByRole('link', { name: 'Tech' })
    .click();
  await expect(page).toHaveURL('/tech');
  await expect(page.locator('[data-back]')).toBeHidden();
});

test('存在しない URL では 404 ページを表示する', async ({ page }) => {
  const response = await page.goto('/works/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Not Found' })).toBeVisible();
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('作品詳細の本文が読める', async ({ page }) => {
    await page.goto('/works');
    await page.locator(workLinks).first().click();

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Overview' })).toBeVisible();
    await expect(page.locator('[data-back]')).toHaveText('All Works');
  });
});
