import { describe, expect, it } from 'vitest';
import FakeContent from '@/test/FakeContent.astro';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import type { NoteDetail } from '../load-notes';
import NoteArticle from '../NoteArticle.astro';

const note: NoteDetail = {
  id: 'n',
  href: '/notes/n',
  title: '記事',
  date: '2026-09-20',
  category: 'Tech',
  tags: techTags('ts'),
  summary: '要約',
  Content: FakeContent,
  relatedWorks: [],
};

describe('NoteArticle', () => {
  it('要約と本文を出す', async () => {
    const root = await renderAstro(NoteArticle, { props: { note } });
    expect(root.querySelector('article')?.textContent).toContain('要約');
    expect(root.querySelector('article [data-fake-content]')).not.toBeNull();
  });

  it('更新日があるときだけ出す', async () => {
    const without = await renderAstro(NoteArticle, { props: { note } });
    expect(without.textContent).not.toContain('更新');
    const withUpdated = await renderAstro(NoteArticle, {
      props: { note: { ...note, updated: '2026-09-24' } },
    });
    expect(withUpdated.querySelector('time[datetime="2026-09-24"]')).not.toBeNull();
  });

  it('関連付けた作品があるときだけ Related Works を出す', async () => {
    const without = await renderAstro(NoteArticle, { props: { note } });
    expect(without.textContent).not.toContain('Related Works');
    const withWorks = await renderAstro(NoteArticle, {
      props: {
        note: { ...note, relatedWorks: [{ href: '/works/w', title: '作品', summary: '概要' }] },
      },
    });
    expect(withWorks.textContent).toContain('Related Works');
    expect(withWorks.querySelector('a[href="/works/w"]')).not.toBeNull();
  });
});
