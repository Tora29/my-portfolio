import { describe, expect, it } from 'vitest';
import { buildTechTags, type TechTagSource } from './tech-tags';

const source: TechTagSource = {
  tech: new Map([
    ['ts', { name: 'TypeScript', category: 'lang' }],
    ['py', { name: 'Python', category: 'lang' }],
    ['react', { name: 'React', category: 'front' }],
    ['next', { name: 'Next.js', category: 'front' }],
    ['aws', { name: 'AWS', category: 'cloud' }],
    ['docker', { name: 'Docker', category: 'cloud' }],
    ['vitest', { name: 'Vitest', category: 'test' }],
    ['unused', { name: 'Unused', category: 'test' }],
  ]),
  // ジャンルの表示順（front を lang より前にして、並べ替えが効いていることを確かめる）
  categories: [
    { id: 'front', name: 'Frontend' },
    { id: 'lang', name: 'Language' },
    { id: 'cloud', name: 'Cloud' },
    { id: 'test', name: 'Testing' },
  ],
  linkable: new Set(['ts', 'py', 'react', 'next', 'aws', 'docker', 'vitest']),
  hrefOf: (id) => `/tech/${id}`,
};

describe('buildTechTags', () => {
  it('表示名とリンク先を付け、書かれた順に並べる', () => {
    const list = buildTechTags(['py', 'ts'], source);
    expect(list.tags).toEqual([
      { id: 'py', label: 'Python', href: '/tech/py' },
      { id: 'ts', label: 'TypeScript', href: '/tech/ts' },
    ]);
  });

  it('詳細ページのない Tech はリンクにしない', () => {
    expect(buildTechTags(['unused'], source).tags[0].href).toBeUndefined();
  });

  it('6個以下なら全件を表示し、展開の操作を出さない', () => {
    const list = buildTechTags(['ts', 'py', 'react', 'next', 'aws', 'docker'], source);
    expect(list.visible).toHaveLength(6);
    expect(list.hiddenCount).toBe(0);
    expect(list.groups).toEqual([]);
  });

  it('7個以上なら先頭6個と残りの件数を返す', () => {
    const list = buildTechTags(['ts', 'py', 'react', 'next', 'aws', 'docker', 'vitest'], source);
    expect(list.visible.map((t) => t.id)).toEqual(['ts', 'py', 'react', 'next', 'aws', 'docker']);
    expect(list.hiddenCount).toBe(1);
  });

  it('展開後はジャンルの表示順にまとめ、ジャンル内は書かれた順を保つ', () => {
    const list = buildTechTags(['vitest', 'next', 'py', 'react', 'ts', 'docker', 'aws'], source);
    expect(list.groups.map((g) => [g.name, g.tags.map((t) => t.id)])).toEqual([
      ['Frontend', ['next', 'react']],
      ['Language', ['py', 'ts']],
      ['Cloud', ['docker', 'aws']],
      ['Testing', ['vitest']],
    ]);
  });
});
