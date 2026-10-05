import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import type { WorkListItem } from '../load-works';
import WorkList from '../WorkList.astro';

const work = (i: number, overrides: Partial<WorkListItem> = {}): WorkListItem => ({
  id: `w${i}`,
  href: `/works/w${i}`,
  title: `作品${i}`,
  summary: '概要',
  tags: techTags('ts'),
  ...overrides,
});

describe('WorkList', () => {
  it('作品がなければ「まだありません」と表示する', async () => {
    const root = await renderAstro(WorkList, { props: { works: [] } });
    expect(root.textContent).toContain('まだありません');
    expect(root.querySelector('ul')).toBeNull();
  });

  it('7件目以降を畳む対象にし、「もっと見る」に残りの件数を出す', async () => {
    const works = Array.from({ length: 8 }, (_, i) => work(i));
    const root = await renderAstro(WorkList, { props: { works } });
    const extra = root.querySelectorAll('li[data-extra]');
    expect([...extra].map((li) => li.querySelector('h2')?.textContent?.trim())).toEqual([
      '作品6',
      '作品7',
    ]);
    expect(root.querySelector('[data-show-more-button]')?.textContent).toContain('残り 2 件');
  });

  it('最新の Activity があれば、その作品で絞り込んだ Activity 一覧へリンクする', async () => {
    const latest = {
      date: '2026-09-24',
      label: '9/24',
      headline: '見出し',
      href: '/activity?work=w0',
    };
    const root = await renderAstro(WorkList, { props: { works: [work(0, { latest })] } });
    const link = root.querySelector('a[href="/activity?work=w0"]');
    expect(link?.textContent).toContain('見出し');
  });

  it('最新の Activity がなければ Activity へのリンクを出さない', async () => {
    const root = await renderAstro(WorkList, { props: { works: [work(0)] } });
    expect(root.querySelector('a[href^="/activity"]')).toBeNull();
  });
});
