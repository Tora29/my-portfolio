import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import TechTags from '../TechTags.astro';

describe('TechTags', () => {
  it('6個以下なら全件を並べ、「+N」を出さない', async () => {
    const root = await renderAstro(TechTags, { props: { list: techTags('a', 'b') } });
    expect([...root.querySelectorAll('a')].map((a) => a.textContent)).toEqual(['a', 'b']);
    expect(root.querySelector('[data-tech-tags]')).toBeNull();
  });

  it('7個以上なら先頭6個と「+N」を出し、ジャンル別の全件も出力する', async () => {
    const list = techTags('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
    const root = await renderAstro(TechTags, { props: { list } });

    const open = root.querySelector('[data-tech-tags-open]');
    expect(open?.textContent?.trim()).toBe('+2');
    expect(open?.getAttribute('aria-label')).toBe('残り 2 件の技術も表示する');
    expect(open?.parentElement?.querySelectorAll('a')).toHaveLength(6);
    // JavaScript が無効なときに読めるよう、全件は HTML に含める
    expect(root.querySelectorAll('[data-tech-tags-full] a')).toHaveLength(8);
    expect(root.querySelector('[data-tech-tags-full]')?.textContent).toContain('Language');
  });
});
