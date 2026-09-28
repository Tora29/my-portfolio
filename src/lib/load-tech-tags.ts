/**
 * Tech タグの列を Content Collections から組み立てる
 *
 * tech-tags.ts の純粋な処理に、tech.yml・tech-categories.yml と Engineering Graph の結果を渡す橋渡し役。
 * ビルド時（ページの生成時）にのみ呼ぶ。ブラウザ向けのスクリプトから import しない。
 */
import { getCollection } from 'astro:content';
import { totalCount } from '@/lib/graph/build-graph';
import { loadGraph, loadTechCategories } from '@/lib/graph/load-graph';
import { buildTechTags, type TechTagList, type TechTagSource } from './tech-tags';

/** Tech 詳細のURL */
export const techHref = (id: string) => `/tech/${id}`;

let cached: Promise<TechTagSource> | undefined;

async function loadSource(): Promise<TechTagSource> {
  const [tech, categories, graph] = await Promise.all([
    getCollection('tech'),
    loadTechCategories(),
    loadGraph(),
  ]);
  return {
    tech: new Map(tech.map((e) => [e.id, { name: e.data.name, category: e.data.category.id }])),
    categories,
    // Tech 詳細は実績のある Tech にだけ作られる（features/tech/load-tech.ts と同じ条件）。
    // プロフィールの Strengths のように、Engineering Graph の集計対象でない場所からも参照されるため確認する
    linkable: new Set(
      [...graph.tech.values()].filter((node) => totalCount(node) > 0).map((n) => n.id),
    ),
    hrefOf: techHref,
  };
}

/** Tech の参照（{ id } の配列）からタグの列を作る。対応表はビルド中に1回だけ作る */
export async function loadTechTags(refs: { id: string }[]): Promise<TechTagList> {
  cached ??= loadSource();
  return buildTechTags(
    refs.map((ref) => ref.id),
    await cached,
  );
}
