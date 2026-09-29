import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import ShowMore from '../ShowMore.astro';

describe('ShowMore', () => {
  it('畳まれる項目があれば、残りの件数を付けたボタンを出す', async () => {
    const root = await renderAstro(ShowMore, {
      props: { rest: 3 },
      slots: { default: '<ul><li>項目</li></ul>' },
    });
    expect(root.querySelector('[data-show-more] li')?.textContent).toBe('項目');
    expect(root.querySelector('[data-show-more-button]')?.textContent).toContain('残り 3 件');
  });

  it('畳まれる項目がなければボタンを出さない', async () => {
    const root = await renderAstro(ShowMore, { props: { rest: 0 } });
    expect(root.querySelector('[data-show-more-button]')).toBeNull();
  });
});
