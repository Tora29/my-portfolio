import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import MoreLink from '../MoreLink.astro';

describe('MoreLink', () => {
  it('サイト内のリンクは同じタブで開く', async () => {
    const root = await renderAstro(MoreLink, {
      props: { href: '/activity' },
      slots: { default: 'すべての Activity を見る' },
    });
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/activity');
    expect(link?.hasAttribute('target')).toBe(false);
    expect(link?.textContent).toContain('すべての Activity を見る');
  });

  it('external のときは新しいタブで開く', async () => {
    const root = await renderAstro(MoreLink, {
      props: { href: 'https://zenn.dev/example', external: true },
      slots: { default: 'Zenn' },
    });
    const link = root.querySelector('a');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
  });
});
