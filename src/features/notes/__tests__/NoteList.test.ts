import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import type { NoteListItem } from '../load-notes';
import NoteList from '../NoteList.astro';

const note = (i: number): NoteListItem => ({
  id: `n${i}`,
  href: `https://zenn.dev/example/articles/n${i}`,
  title: `記事${i}`,
  date: '2026-09-24',
  tags: techTags('ts'),
});

describe('NoteList', () => {
  it('記事がなければ「まだありません」と表示する', async () => {
    const root = await renderAstro(NoteList, { props: { notes: [] } });
    expect(root.textContent).toContain('まだありません');
  });

  it('11件目以降を畳む対象にし、「もっと見る」に残りの件数を出す', async () => {
    const notes = Array.from({ length: 12 }, (_, i) => note(i));
    const root = await renderAstro(NoteList, { props: { notes } });
    const extra = root.querySelectorAll('li[data-extra]');
    expect([...extra].map((li) => li.querySelector('a')?.textContent?.trim())).toEqual([
      '記事10',
      '記事11',
    ]);
    expect(root.querySelector('[data-show-more-button]')?.textContent).toContain('残り 2 件');
  });

  it('10件以下なら「もっと見る」を出さない', async () => {
    const notes = Array.from({ length: 10 }, (_, i) => note(i));
    const root = await renderAstro(NoteList, { props: { notes } });
    expect(root.querySelector('[data-extra]')).toBeNull();
    expect(root.querySelector('[data-show-more-button]')).toBeNull();
  });

  it('Zenn の URL があるときだけ案内を出す（記事が0件でも出す）', async () => {
    const without = await renderAstro(NoteList, { props: { notes: [] } });
    expect(without.querySelector('a[href^="https://zenn.dev"]')).toBeNull();
    const withZenn = await renderAstro(NoteList, {
      props: { notes: [], zenn: 'https://zenn.dev/example' },
    });
    expect(withZenn.querySelector('a[href="https://zenn.dev/example"]')).not.toBeNull();
  });
});
