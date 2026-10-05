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

describe('ExternalLink のアイコン', () => {
  const render = (props: Record<string, unknown>) =>
    renderAstro(ExternalLink, {
      props: { href: 'https://github.com/example', ...props },
      slots: { default: 'GitHub' },
    });

  it('既定では、後ろに外部リンクの印だけを付ける', async () => {
    expect((await render({})).querySelectorAll('svg')).toHaveLength(1);
  });

  it('icon を渡すと前にも置き、arrow={false} で後ろの印を外す', async () => {
    expect((await render({ icon: 'github-logo' })).querySelectorAll('svg')).toHaveLength(2);
    expect(
      (await render({ icon: 'arrow-up-right', arrow: false })).querySelectorAll('svg'),
    ).toHaveLength(1);
  });
});
