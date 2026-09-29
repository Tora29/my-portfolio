import { describe, expect, it } from 'vitest';
import { renderAstro, textOf } from '@/test/render';
import type { TechDetail as TechDetailData } from '../load-tech';
import TechDetail from '../TechDetail.astro';

const empty: TechDetailData = {
  id: 'ts',
  name: 'TypeScript',
  childNames: [],
  works: [],
  notes: [],
  career: [],
  activity: [],
  related: [],
};

const headings = (root: HTMLElement) => [...root.querySelectorAll('section > h2')].map(textOf);

describe('TechDetail', () => {
  it('実績が0件の種類も見出しを残し「まだありません」と表示する', async () => {
    const root = await renderAstro(TechDetail, { props: { tech: empty } });
    expect(headings(root)).toEqual(['Works 0', 'Notes 0', 'Career 0', 'Activity 0']);
    expect(root.textContent?.match(/まだありません/g)).toHaveLength(4);
  });

  it('実績を種類ごとに件数付きで並べる', async () => {
    const root = await renderAstro(TechDetail, {
      props: {
        tech: {
          ...empty,
          works: [{ href: '/works/w', title: '作品', summary: '概要' }],
          notes: [
            { href: '/notes/a', title: '記事A', date: '2026-09-24' },
            { href: '/notes/b', title: '記事B', date: '2026-09-20' },
          ],
        },
      },
    });
    expect(headings(root)).toEqual(['Works 1', 'Notes 2', 'Career 0', 'Activity 0']);
    expect(root.querySelector('a[href="/notes/b"]')).not.toBeNull();
  });

  it('下位の技術があれば、その実績を含むことを示す', async () => {
    const root = await renderAstro(TechDetail, {
      props: { tech: { ...empty, childNames: ['React', 'Vue'] } },
    });
    expect(root.textContent).toContain('下位の技術（React · Vue）の実績も含みます。');
  });

  it('関連 Tech があるときだけ出す', async () => {
    const without = await renderAstro(TechDetail, { props: { tech: empty } });
    expect(without.textContent).not.toContain('Related Tech');
    const withRelated = await renderAstro(TechDetail, {
      props: { tech: { ...empty, related: [{ href: '/tech/js', label: 'JavaScript' }] } },
    });
    expect(withRelated.querySelector('a[href="/tech/js"]')?.textContent).toBe('JavaScript');
  });
});
