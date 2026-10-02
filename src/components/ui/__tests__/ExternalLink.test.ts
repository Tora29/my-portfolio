import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import ExternalLink from '../ExternalLink.astro';

describe('ExternalLink', () => {
  it('新しいタブで開くリンクにする', async () => {
    const root = await renderAstro(ExternalLink, {
      props: { href: 'https://zenn.dev/example/articles/a' },
      slots: { default: '記事' },
    });
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://zenn.dev/example/articles/a');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
    expect(link?.textContent).toContain('記事');
  });
});
