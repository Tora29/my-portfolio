import { expect, test } from '@playwright/test';

// 記事一覧・詳細の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// 記事は増え続けるため、特定のタイトルや件数には依存せず、構造と遷移だけを確かめる

const noteLinks = 'main li a[href^="/notes/"]';

test('記事一覧が表示され、現在のタブが Notes になっている', async ({ page }) => {
  await page.goto('/notes');

  await expect(page.getByRole('heading', { level: 1, name: 'Notes' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link', {
      name: 'Notes',
    }),
  ).toHaveAttribute('aria-current', 'page');
});

test('一覧から記事を開き、Related Tech から Tech 詳細へ移動できる', async ({ page }) => {
  await page.goto('/notes');
  const note = page.locator(noteLinks).first();
  test.skip((await note.count()) === 0, '記事がまだない');

  const title = (await note.textContent())!.trim();
  await note.click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await expect(page.locator('[data-back]')).toHaveText('Notes');

  const tag = page
    .locator('section', { has: page.getByRole('heading', { name: 'Related Tech' }) })
    .locator('a[href^="/tech/"]:visible')
    .first();
  const techName = (await tag.textContent())!.trim();
  await tag.click();
  await expect(page.getByRole('heading', { level: 1, name: techName })).toBeVisible();
  // Tech 詳細の Notes に、元の記事が載っている
  await expect(
    page.locator('[data-back-scope] a[href^="/notes/"]', { hasText: title }),
  ).toBeVisible();
});

test('記事には正規の URL と共有用の情報（OGP）がある', async ({ page }) => {
  await page.goto('/notes');
  const note = page.locator(noteLinks).first();
  test.skip((await note.count()) === 0, '記事がまだない');

  const href = (await note.getAttribute('href'))!;
  await page.goto(href);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    new RegExp(`${href}$`),
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('記事の本文が読める', async ({ page }) => {
    await page.goto('/notes');
    const note = page.locator(noteLinks).first();
    test.skip((await note.count()) === 0, '記事がまだない');

    await note.click();
    await expect(page.locator('article h2').first()).toBeVisible();
  });
});
