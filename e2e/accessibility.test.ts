import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.1 A / AA の自動チェック（.claude/rules/accessibility.md）。
// axe で検出できる範囲（コントラスト・名前・構造など）だけを確かめる。キーボード操作は別のテストで確かめる

const PAGES = [
  '/',
  '/about',
  '/career',
  '/works',
  '/works/personal-platform',
  '/tech',
  '/tech/typescript',
  '/notes',
  '/activity',
  '/does-not-exist',
];

test.beforeEach(async ({ page }) => {
  // イントロと演出の途中の状態を検査しないよう、イントロを飛ばし、動きを止める
  await page.addInitScript(() => {
    (window as unknown as { __homeIntroPlayed: boolean }).__homeIntroPlayed = true;
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const path of PAGES) {
  test(`${path} に WCAG 2.1 AA の違反がない`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
      count: v.nodes.length,
    }));
    expect(summary).toEqual([]);
  });
}

test.describe('キーボード操作', () => {
  test('Home の名前・4つの惑星・停止ボタンに Tab で移動できる', async ({ page }) => {
    await page.goto('/');
    const reached = new Set<string>();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      reached.add(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          return el?.getAttribute('href') ?? el?.getAttribute('aria-label') ?? '';
        }),
      );
    }
    for (const href of ['/about', '/career', '/works', '/tech', '/notes']) {
      expect(reached, href).toContain(href);
    }
    expect([...reached].some((name) => name.startsWith('背景の動きを'))).toBe(true);
  });

  test('Career の Tech タグの「+N」を押したあと、全件の列へフォーカスが移る', async ({ page }) => {
    await page.goto('/career');
    const open = page.locator('[data-tech-tags-open]').first();
    test.skip((await open.count()) === 0, 'Tech タグが7個以上の職歴がない');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await open.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-tech-tags-full]').first()).toBeFocused();
  });

  test('Activity の「もっと見る」を押したあと、展開した最初の日付へフォーカスが移る', async ({
    page,
  }) => {
    await page.goto('/activity');
    const more = page.locator('[data-activity-more]');
    test.skip(!(await more.isVisible()), 'Activity が初期表示件数以下');

    // 押す前に畳まれている最初の日付が、展開後のフォーカスの移り先
    const firstFolded = page.locator('[data-activity-date][hidden]').first();
    const date = await firstFolded.locator('time').getAttribute('datetime');
    await more.focus();
    await page.keyboard.press('Enter');
    await expect(more).toBeHidden();
    await expect(
      page.locator('[data-activity-date]', { has: page.locator(`time[datetime="${date}"]`) }),
    ).toBeFocused();
  });
});
