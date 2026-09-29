import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderAstro } from '@/test/render';
import HomeScene from '../HomeScene.astro';
import type { HomePage } from '../load-home';

const page: HomePage = {
  name: 'Tora',
  role: 'Engineer',
  planets: [
    { id: 'career', title: 'Career', href: '/career', color: '#fff', moons: 1 },
    { id: 'works', title: 'Works', href: '/works', color: '#fff', moons: 2, updated: '2026-09-24' },
    { id: 'tech', title: 'Tech', href: '/tech', color: '#fff', moons: 0 },
    { id: 'notes', title: 'Notes', href: '/notes', color: '#fff', moons: 0 },
  ],
};

// JavaScript が無効なときの表示は、ビルドした日で判定する
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-29T00:00:00+09:00'));
});
afterEach(() => {
  vi.useRealTimers();
});

describe('HomeScene', () => {
  it('JavaScript なしでも、名前から About へ、惑星から各セクションへ移動できる', async () => {
    const root = await renderAstro(HomeScene, { props: { page } });
    expect(root.querySelector('a[href="/about"]')?.textContent).toContain('Tora');
    const planets = [...root.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    expect(planets).toEqual(['/career', '/works', '/tech', '/notes']);
  });

  it('更新があった惑星にだけ、更新日を持つ点を置く', async () => {
    const root = await renderAstro(HomeScene, { props: { page } });
    const dots = root.querySelectorAll('[data-fresh]');
    expect(dots).toHaveLength(1);
    expect(dots[0].closest('[data-planet]')?.getAttribute('data-planet')).toBe('works');
  });

  it('GitHub・最新の Activity がなければ出さない', async () => {
    const root = await renderAstro(HomeScene, { props: { page } });
    expect(root.textContent).not.toContain('GitHub');
    expect(root.querySelector('[data-latest]')).toBeNull();
  });

  it('最新の Activity に、ビルドした日からの経過日数による表示を付ける', async () => {
    const latest = (date: string) => ({ date, label: date, text: '更新' });
    const recent = await renderAstro(HomeScene, {
      props: { page: { ...page, latest: latest('2026-09-28') } },
    });
    const old = await renderAstro(HomeScene, {
      props: { page: { ...page, latest: latest('2026-01-01') } },
    });
    const freshness = (root: HTMLElement) =>
      root.querySelector('[data-latest]')?.getAttribute('data-freshness');
    expect(freshness(recent)).toBe('live');
    expect(freshness(old)).toBe('stale');
  });
});
