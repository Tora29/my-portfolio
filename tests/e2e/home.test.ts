import { expect, test } from '@playwright/test';

// Home の入口（.claude/rules/testing.md の E2E の範囲）。演出（Canvas）はテストしない

const SECTIONS = ['/about', '/career', '/works', '/tech', '/notes', '/activity'];

test('名前から About へ移動できる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).click();
  await expect(page).toHaveURL('/about');
});

// 惑星は公転し続けるため、Playwright が「止まった要素」として押せない。
// 動きを減らす設定（prefers-reduced-motion）にして、シーンが止まった状態を描くことも合わせて確かめる
test('惑星から各セクションへ移動できる（動きを減らす設定）', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const planets = page.getByRole('navigation', { name: 'セクション' });
  for (const name of ['Career', 'Works', 'Tech', 'Notes']) {
    await planets.getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await page.getByRole('link', { name: '閉じて Home に戻る' }).click();
    await expect(page).toHaveURL('/');
  }
});

test('ページ遷移を繰り返しても、描画の処理が重複しない', async ({ page }) => {
  // requestAnimationFrame の呼び出し回数を数える。シーンが止まらずに残ると、遷移のたびに回数が増える
  await page.addInitScript(() => {
    const w = window as unknown as { __raf: number };
    w.__raf = 0;
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      w.__raf++;
      return original(callback);
    };
  });
  const rafPerSecond = async () => {
    const before = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    return after - before;
  };

  await page.goto('/');
  const first = await rafPerSecond();
  expect(first).toBeGreaterThan(0);
  for (let i = 0; i < 3; i++) {
    // 動かない名前のリンクで移動する（惑星は公転していて押せないため）
    await page.getByRole('heading', { level: 1 }).click();
    await expect(page).toHaveURL('/about');
    // Home を離れたら、シーンの描画は止まっている
    expect(await rafPerSecond()).toBeLessThanOrEqual(2);
    await page.getByRole('link', { name: '閉じて Home に戻る' }).click();
    await expect(page).toHaveURL('/');
  }
  // 戻ってきたら再び動き、1回目と同程度であること（重複していれば回数が増える）
  const later = await rafPerSecond();
  expect(later).toBeGreaterThan(0);
  expect(later).toBeLessThan(first * 1.5 + 5);
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
