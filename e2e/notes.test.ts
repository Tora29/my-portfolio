import { expect, test } from '@playwright/test';

// 記事一覧の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// 記事の本文は Zenn で公開しているため、一覧から Zenn の記事へ、Tech タグから Tech 詳細へつながることを確かめる。
// 記事は増え続けるため、特定のタイトルや件数には依存せず、構造と遷移だけを確かめる

const zennLink = 'a[href^="https://zenn.dev/"]';
const noteLinks = `main li ${zennLink}`;

test('記事一覧が表示され、現在のタブが Notes になっている', async ({ page }) => {
  await page.goto('/notes');

  await expect(page.getByRole('heading', { level: 1, name: 'Notes' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link', {
      name: 'Notes',
    }),
  ).toHaveAttribute('aria-current', 'page');
});

test('記事は Zenn の記事を新しいタブで開くリンクになっている', async ({ page }) => {
  await page.goto('/notes');
  const note = page.locator(noteLinks).first();
  test.skip((await note.count()) === 0, '記事がまだない');

  await expect(note).toHaveAttribute('href', /^https:\/\/zenn\.dev\/[^/]+\/articles\/[\w-]+$/);
  await expect(note).toHaveAttribute('target', '_blank');
});

test('記事の Tech タグから Tech 詳細へ移動でき、その記事が載っている', async ({ page }) => {
  await page.goto('/notes');
  const item = page.locator('main li', { has: page.locator(zennLink) }).first();
  test.skip((await item.count()) === 0, '記事がまだない');

  const note = item.locator(zennLink);
  const href = (await note.getAttribute('href'))!;
  const tag = item.locator('a[href^="/tech/"]:visible').first();
  test.skip((await tag.count()) === 0, 'Tech に対応する topics がない');

  const techName = (await tag.textContent())!.trim();
  await tag.click();
  await expect(page.getByRole('heading', { level: 1, name: techName })).toBeVisible();
  await expect(page.locator(`[data-back-scope] a[href="${href}"]`)).toBeVisible();
});

test('以前の記事ページの URL は Zenn の記事へ転送する', async ({ request }) => {
  const response = await request.get('/notes/static-first-portfolio');
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain(
    'https://zenn.dev/tora29/articles/static-first-portfolio',
  );
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('記事一覧が読める', async ({ page }) => {
    await page.goto('/notes');
    const note = page.locator(noteLinks).first();
    test.skip((await note.count()) === 0, '記事がまだない');

    await expect(note).toBeVisible();
  });
});
