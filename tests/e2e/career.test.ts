import { expect, test } from '@playwright/test';

// Career の表示と導線（.claude/rules/testing.md の E2E の範囲）。
// 職歴の内容や件数には依存せず、構造と遷移だけを確かめる

test('職歴と資格が表示され、現在のタブが Career になっている', async ({ page }) => {
  await page.goto('/career');

  await expect(page.getByRole('heading', { level: 1, name: 'Career' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'セクション', exact: true }).getByRole('link', {
      name: 'Career',
    }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('main ol > li').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
});

test('Tech タグから Tech 詳細へ移動し、戻るボタンで Career へ戻れる', async ({ page }) => {
  await page.goto('/career');
  const tag = page.locator('main ol a[href^="/tech/"]:visible').first();
  const name = (await tag.textContent())!.trim();
  await tag.click();

  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  const back = page.locator('[data-back]');
  await expect(back).toHaveText('Career');
  await back.click();
  await expect(page).toHaveURL('/career');
});

test('7個以上の Tech タグは「+N」で展開し、「閉じる」で戻せる', async ({ page }) => {
  await page.goto('/career');
  const tags = page.locator('[data-tech-tags]').first();
  test.skip((await tags.count()) === 0, 'Tech タグが7個以上の職歴がない');

  const full = tags.locator('[data-tech-tags-full]');
  await expect(full).toBeHidden();
  await tags.locator('[data-tech-tags-open]').click();
  await expect(full).toBeVisible();
  await tags.locator('[data-tech-tags-close]').click();
  await expect(full).toBeHidden();
  await expect(tags.locator('[data-tech-tags-open]')).toBeVisible();
});

test.describe('JavaScript なし', () => {
  test.use({ javaScriptEnabled: false });

  test('Tech タグがジャンル別に全件表示される', async ({ page }) => {
    await page.goto('/career');
    const tags = page.locator('[data-tech-tags]').first();
    test.skip((await tags.count()) === 0, 'Tech タグが7個以上の職歴がない');

    await expect(tags.locator('[data-tech-tags-full]')).toBeVisible();
    await expect(tags.locator('[data-tech-tags-open]')).toBeHidden();
    await expect(tags.locator('[data-tech-tags-close]')).toBeHidden();
  });
});
