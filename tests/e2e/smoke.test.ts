import { expect, test } from '@playwright/test';

test('トップページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

// GitHub Pages は dir/index.html を末尾スラッシュ付きの URL へ 301 で転送するため、
// ページを file 形式（tech.html）で出力し、末尾スラッシュなしの URL がそのまま開けることを確かめる
test('末尾スラッシュなしの URL がリダイレクトされずに開ける', async ({ page }) => {
  for (const path of ['/tech']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page).toHaveURL(path);
  }
});
