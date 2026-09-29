import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import Subheading from '../Subheading.astro';

describe('Subheading', () => {
  it('既定では h2 で、件数を出さない', async () => {
    const root = await renderAstro(Subheading, { props: { label: 'Works' } });
    const heading = root.querySelector('h2');
    expect(heading?.textContent?.trim()).toBe('Works');
    expect(heading?.querySelector('span')).toBeNull();
  });

  it('count を渡すと見出しの後ろに件数を出す（0件も出す）', async () => {
    const root = await renderAstro(Subheading, { props: { label: 'Works', count: 0 } });
    expect(root.querySelector('h2 span')?.textContent).toBe('0');
  });

  it('as と id で見出しのレベルと id を指定できる', async () => {
    const root = await renderAstro(Subheading, {
      props: { label: 'Language', as: 'h3', id: 'lang' },
    });
    expect(root.querySelector('h2')).toBeNull();
    expect(root.querySelector('h3')?.id).toBe('lang');
  });
});
