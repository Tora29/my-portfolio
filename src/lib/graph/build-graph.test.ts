import { describe, expect, it } from 'vitest';
import { buildGraph, findParentCycle, groupByCategory, totalCount } from './build-graph';
import type { ContentInput, TechInput } from './types';

const tech: TechInput[] = [
  { id: 'aws', name: 'AWS', category: 'cloud' },
  { id: 'lambda', name: 'Lambda', category: 'cloud', parent: 'aws' },
  { id: 'eventbridge', name: 'EventBridge', category: 'cloud', parent: 'aws' },
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'python', name: 'Python', category: 'language' },
  { id: 'terraform', name: 'Terraform', category: 'cloud' },
];

const work = (id: string, techIds: string[]): ContentInput => ({
  kind: 'works',
  id,
  tech: techIds,
});
const note = (id: string, techIds: string[]): ContentInput => ({
  kind: 'notes',
  id,
  tech: techIds,
});

describe('buildGraph：逆引き', () => {
  it('Techごとに、直接付与されたコンテンツを種類別に集める', () => {
    const graph = buildGraph({
      tech,
      contents: [
        work('alert', ['lambda', 'typescript']),
        note('retry', ['lambda']),
        { kind: 'career', id: 'company-a', tech: ['lambda'] },
        { kind: 'activity', id: 'Tora29/alert#1', tech: ['typescript'] },
      ],
    });

    expect(graph.tech.get('lambda')!.direct).toEqual({
      works: ['alert'],
      notes: ['retry'],
      career: ['company-a'],
      activity: [],
    });
    expect(graph.tech.get('typescript')!.direct.activity).toEqual(['Tora29/alert#1']);
  });

  it('同一コンテンツ内で重複したTechは1件として扱う', () => {
    const graph = buildGraph({ tech, contents: [work('alert', ['lambda', 'lambda'])] });
    expect(graph.tech.get('lambda')!.direct.works).toEqual(['alert']);
  });

  it('下位Techの一覧を children に持つ', () => {
    const graph = buildGraph({ tech, contents: [] });
    expect(graph.tech.get('aws')!.children).toEqual(['lambda', 'eventbridge']);
    expect(graph.tech.get('lambda')!.children).toEqual([]);
  });
});

describe('buildGraph：階層の集計', () => {
  it('下位Techの実績を上位Techの total に含める', () => {
    const graph = buildGraph({
      tech,
      contents: [work('site', ['aws']), work('alert', ['lambda']), note('events', ['eventbridge'])],
    });
    const aws = graph.tech.get('aws')!;

    expect(aws.direct.works).toEqual(['site']);
    expect(aws.total.works).toEqual(['site', 'alert']);
    expect(aws.total.notes).toEqual(['events']);
  });

  it('上位と下位の両方が付いたコンテンツは、上位の total で1件として数える', () => {
    const graph = buildGraph({
      tech,
      contents: [work('alert', ['aws', 'lambda', 'eventbridge'])],
    });
    expect(graph.tech.get('aws')!.total.works).toEqual(['alert']);
    expect(totalCount(graph.tech.get('aws')!)).toBe(1);
  });

  it('下位Techの total に上位Techの実績を含めない', () => {
    const graph = buildGraph({ tech, contents: [work('site', ['aws'])] });
    expect(totalCount(graph.tech.get('lambda')!)).toBe(0);
  });

  it('種類が異なれば同じ id でも別のコンテンツとして数える', () => {
    const graph = buildGraph({
      tech,
      contents: [work('portfolio', ['typescript']), note('portfolio', ['typescript'])],
    });
    expect(totalCount(graph.tech.get('typescript')!)).toBe(2);
  });
});

describe('buildGraph：関連Tech', () => {
  it('同じコンテンツで併用された回数の多い順に並べる', () => {
    const graph = buildGraph({
      tech,
      contents: [
        work('a', ['typescript', 'terraform', 'python']),
        work('b', ['typescript', 'terraform']),
        note('c', ['typescript', 'terraform']),
      ],
    });
    expect(graph.tech.get('typescript')!.related).toEqual(['terraform', 'python']);
  });

  it('回数が同じときは tech.yml の順に並べる', () => {
    const graph = buildGraph({
      tech,
      contents: [work('a', ['terraform', 'python', 'typescript'])],
    });
    expect(graph.tech.get('terraform')!.related).toEqual(['typescript', 'python']);
  });

  it('自身・上位・下位のTechを除く', () => {
    const graph = buildGraph({
      tech,
      contents: [work('a', ['aws', 'lambda', 'eventbridge', 'typescript'])],
    });
    expect(graph.tech.get('aws')!.related).toEqual(['typescript']);
    expect(graph.tech.get('lambda')!.related).toEqual(['eventbridge', 'typescript']);
  });

  it('下位Techが付いたコンテンツの併用Techも、上位Techの関連に含める', () => {
    const graph = buildGraph({ tech, contents: [work('alert', ['lambda', 'terraform'])] });
    expect(graph.tech.get('aws')!.related).toEqual(['terraform']);
  });

  it('10件までに絞る', () => {
    const many: TechInput[] = Array.from({ length: 12 }, (_, i) => ({
      id: `t${i}`,
      name: `T${i}`,
      category: 'language',
    }));
    const graph = buildGraph({
      tech: many,
      contents: [
        work(
          'a',
          many.map((t) => t.id),
        ),
      ],
    });
    expect(graph.tech.get('t0')!.related).toHaveLength(10);
  });
});

describe('buildGraph：検証', () => {
  it('parent が循環していればエラーにする', () => {
    const cyclic: TechInput[] = [
      { id: 'a', name: 'A', category: 'x', parent: 'b' },
      { id: 'b', name: 'B', category: 'x', parent: 'a' },
    ];
    expect(() => buildGraph({ tech: cyclic, contents: [] })).toThrow('a → b → a');
  });

  it('どのコンテンツからも参照されないTechを unused に挙げる', () => {
    const graph = buildGraph({ tech, contents: [work('alert', ['lambda'])] });
    expect(graph.unused).toEqual(['aws', 'eventbridge', 'typescript', 'python', 'terraform']);
  });
});

describe('findParentCycle', () => {
  it('循環がなければ undefined を返す', () => {
    expect(findParentCycle(tech)).toBeUndefined();
  });

  it('自分自身を parent にしたTechを循環として検出する', () => {
    expect(findParentCycle([{ id: 'a', name: 'A', category: 'x', parent: 'a' }])).toEqual([
      'a',
      'a',
    ]);
  });

  it('3つ以上のTechにまたがる循環を検出する', () => {
    const cyclic: TechInput[] = [
      { id: 'a', name: 'A', category: 'x', parent: 'b' },
      { id: 'b', name: 'B', category: 'x', parent: 'c' },
      { id: 'c', name: 'C', category: 'x', parent: 'a' },
    ];
    expect(findParentCycle(cyclic)).toEqual(['a', 'b', 'c', 'a']);
  });
});

describe('groupByCategory', () => {
  it('ジャンルの表示順で区切り、ジャンル内は実績の多い順に並べる', () => {
    const graph = buildGraph({
      tech,
      contents: [work('a', ['python']), work('b', ['python']), work('c', ['typescript'])],
    });
    const groups = groupByCategory(graph, ['language', 'cloud']);

    expect(groups.map((g) => g.category)).toEqual(['language', 'cloud']);
    expect(groups[0].tech.map((t) => t.id)).toEqual(['python', 'typescript']);
  });

  it('実績が同じときは tech.yml の順に並べる', () => {
    const graph = buildGraph({ tech, contents: [] });
    const [cloud] = groupByCategory(graph, ['cloud']);
    expect(cloud.tech.map((t) => t.id)).toEqual(['aws', 'lambda', 'eventbridge', 'terraform']);
  });

  it('上位Techは下位Techの実績を含めた件数で並べる', () => {
    const graph = buildGraph({
      tech,
      contents: [work('a', ['terraform']), work('b', ['lambda']), work('c', ['eventbridge'])],
    });
    const [cloud] = groupByCategory(graph, ['cloud']);
    expect(cloud.tech[0].id).toBe('aws');
  });
});
