/**
 * Content Collections から Engineering Graph を読み込む
 *
 * build-graph.ts の集計に、Astro のコレクションのデータを渡す橋渡し役。
 * ビルド時（ページの生成時）にのみ呼ぶ。ブラウザ向けのスクリプトから import しない。
 */
import { getCollection } from 'astro:content';
import { buildGraph } from './build-graph';
import type { ContentInput, Graph } from './types';

/**
 * 集計結果のキャッシュ。
 * Tech 一覧・Tech 詳細（Tech の数だけある）など多くのページから呼ばれるため、
 * ビルド中は最初の1回だけ集計し、以降は同じ結果を返す
 */
let cached: Promise<Graph> | undefined;

/** Engineering Graph を返す。ビルド中は1回だけ集計する */
export function loadGraph(): Promise<Graph> {
  cached ??= build();
  return cached;
}

/**
 * ジャンルを tech-categories.yml の記述順（＝表示順）で返す。
 * getCollection は記述順を保証しないため、読み込み時に付けた order で並べ直す
 */
export async function loadTechCategories(): Promise<{ id: string; name: string }[]> {
  const categories = await getCollection('techCategories');
  return categories
    .toSorted((a, b) => a.data.order - b.data.order)
    .map((e) => ({ id: e.id, name: e.data.name }));
}

async function build(): Promise<Graph> {
  const [tech, works, notes, career, activity] = await Promise.all([
    getCollection('tech'),
    getCollection('works'),
    getCollection('notes'),
    getCollection('career'),
    getCollection('activity'),
  ]);

  // コレクションの参照（reference）は { id, collection } の形なので、id だけを取り出す
  const ids = (refs: { id: string }[]) => refs.map((ref) => ref.id);

  // 種類ごとに Tech を書くフィールド名が異なる（Notes だけ tags）ため、ここで揃える
  const contents: ContentInput[] = [
    ...works.map((e) => ({ kind: 'works' as const, id: e.id, tech: ids(e.data.tech) })),
    ...notes.map((e) => ({ kind: 'notes' as const, id: e.id, tech: ids(e.data.tags) })),
    ...career.map((e) => ({ kind: 'career' as const, id: e.id, tech: ids(e.data.tech) })),
    ...activity.map((e) => ({ kind: 'activity' as const, id: e.id, tech: ids(e.data.tech) })),
  ];

  const graph = buildGraph({
    // 同数時の並び順が tech.yml の記述順になるよう、order で並べ直してから渡す
    tech: tech
      .toSorted((a, b) => a.data.order - b.data.order)
      .map((e) => ({
        id: e.id,
        name: e.data.name,
        category: e.data.category.id,
        parent: e.data.parent?.id,
      })),
    contents,
  });

  // 未使用の Tech はビルドを止めない（これから書くコンテンツのために先に定義することがあるため）。
  // 消し忘れに気づけるよう、警告だけを出す
  if (graph.unused.length > 0) {
    console.warn(`[graph] どのコンテンツからも参照されないTech：${graph.unused.join(', ')}`);
  }
  // 技術記事なのに Tech に対応する topic が1つもないのは、topic の書き誤りのことが多い。
  // アイデア記事（idea）は Tech がなくてもよいため、技術記事だけを、ビルドは止めずに警告する
  const untagged = notes.filter((e) => e.data.type === 'tech' && e.data.tags.length === 0);
  if (untagged.length > 0) {
    console.warn(
      `[graph] Tech に対応する topics がない技術記事：${untagged.map((e) => e.id).join(', ')}`,
    );
  }
  return graph;
}
