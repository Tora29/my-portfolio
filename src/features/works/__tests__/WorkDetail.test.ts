import { describe, expect, it } from 'vitest';
import FakeContent from '@/test/FakeContent.astro';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import type { WorkDetail as WorkDetailData } from '../load-works';
import WorkDetail from '../WorkDetail.astro';

const work: WorkDetailData = {
  id: 'w',
  href: '/works/w',
  title: '作品',
  summary: '概要',
  tags: techTags('ts'),
  status: '開発中',
  Content: FakeContent,
  timeline: [],
  activityHref: '/activity?work=w',
  relatedNotes: [],
};

describe('WorkDetail', () => {
  it('状態と本文を出し、cover がなければプレースホルダーを出す', async () => {
    const root = await renderAstro(WorkDetail, { props: { work } });
    expect(root.textContent).toContain('開発中');
    expect(root.querySelector('[data-fake-content]')).not.toBeNull();
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('div[aria-hidden="true"] svg')).not.toBeNull();
  });

  it('Repository があれば新しいタブで開くリンクを出す', async () => {
    const root = await renderAstro(WorkDetail, {
      props: { work: { ...work, github: { label: 'owner/repo', href: 'https://github.com/o/r' } } },
    });
    const link = root.querySelector('a[href="https://github.com/o/r"]');
    expect(link?.textContent).toContain('owner/repo');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('Activity・記事がなければ Development Timeline・Related Notes を出さない', async () => {
    const root = await renderAstro(WorkDetail, { props: { work } });
    expect(root.textContent).not.toContain('Development Timeline');
    expect(root.textContent).not.toContain('Related Notes');
  });

  it('Development Timeline に件数を出し、作品で絞り込んだ Activity 一覧へリンクする', async () => {
    const item = { icon: 'git-pull-request' as const, headline: '見出し', summary: '要約' };
    const root = await renderAstro(WorkDetail, {
      props: {
        work: {
          ...work,
          timeline: [
            { ...item, date: '2026-09-24', label: '9/24' },
            { ...item, date: '2026-09-20', label: '9/20' },
          ],
        },
      },
    });
    expect(root.textContent).toMatch(/Development Timeline\s*2/);
    expect(root.querySelectorAll('ol > li')).toHaveLength(2);
    expect(root.querySelector('a[href="/activity?work=w"]')).not.toBeNull();
  });

  it('Related Notes に関連の理由を出す', async () => {
    const root = await renderAstro(WorkDetail, {
      props: {
        work: {
          ...work,
          relatedNotes: [
            { href: '/notes/n', title: '記事', date: '2026-09-24', reason: 'Tech が共通' },
          ],
        },
      },
    });
    expect(root.querySelector('a[href="/notes/n"]')).not.toBeNull();
    expect(root.textContent).toContain('Tech が共通');
  });
});
