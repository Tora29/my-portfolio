import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import BackButton from '../BackButton.astro';

describe('BackButton', () => {
  it('fallback があれば、その一覧へ戻るリンクとして表示する', async () => {
    const root = await renderAstro(BackButton, {
      props: { fallback: { href: '/works', label: 'Works' } },
    });
    const link = root.querySelector<HTMLAnchorElement>('[data-back]');
    expect(link?.getAttribute('href')).toBe('/works');
    expect(link?.hidden).toBe(false);
    expect(link?.querySelector('[data-back-label]')?.textContent?.trim()).toBe('Works');
  });

  it('fallback がなければ隠しておく（直前のページが分かったときだけ JavaScript で出す）', async () => {
    const root = await renderAstro(BackButton);
    expect(root.querySelector<HTMLAnchorElement>('[data-back]')?.hidden).toBe(true);
  });
});
