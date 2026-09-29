import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import type { TechGenre, TechListItem } from '../load-tech';
import TechList from '../TechList.astro';

const tech = (id: string, overrides: Partial<TechListItem> = {}): TechListItem => ({
  id,
  name: id,
  href: `/tech/${id}`,
  childNames: [],
  counts: { works: 0, notes: 0, career: 0, activity: 0 },
  relatedContents: [],
  ...overrides,
});

const genres: TechGenre[] = [
  { id: 'lang', name: 'Language', tech: [tech('ts'), tech('py')] },
  { id: 'cloud', name: 'Cloud', tech: [tech('aws')] },
];

describe('TechList', () => {
  it('ジャンルへのジャンプのリンク先に、そのジャンルの区切りがある', async () => {
    const root = await renderAstro(TechList, { props: { genres } });
    const anchors = [...root.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    expect(anchors).toEqual(['#tech-genre-lang', '#tech-genre-cloud']);
    for (const href of anchors) {
      expect(root.querySelector(href!)).not.toBeNull();
    }
  });

  it('ジャンルごとに Tech の行を並べ、詳細へリンクする', async () => {
    const root = await renderAstro(TechList, { props: { genres } });
    const links = root.querySelectorAll('#tech-genre-lang li > a');
    expect([...links].map((a) => a.getAttribute('href'))).toEqual(['/tech/ts', '/tech/py']);
  });

  it('行には下位の技術と関連するコンテンツ名を出す', async () => {
    const root = await renderAstro(TechList, {
      props: {
        genres: [
          {
            id: 'front',
            name: 'Frontend',
            tech: [tech('js', { childNames: ['React'], relatedContents: ['作品A', '記事B'] })],
          },
        ],
      },
    });
    const row = root.querySelector('li')?.textContent;
    expect(row).toContain('+ React');
    expect(row).toContain('作品A · 記事B');
  });
});
