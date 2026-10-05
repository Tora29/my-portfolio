/**
 * Tech タグの列を Content Collections から組み立てる
 *
 * tech-tags.ts の純粋な処理に、tech.yml・tech-categories.yml と Engineering Graph の結果を渡す橋渡し役。
 * ビルド時（ページの生成時）にのみ呼ぶ。ブラウザ向けのスクリプトから import しない。
 */
import { getCollection } from 'astro:content';
import { hasRecords } from '@/lib/graph/build-graph';
import { loadGraph, loadTechCategories } from '@/lib/graph/load-graph';
import { buildTechTags, type TechTagList, type TechTagSource } from './tech-tags';
import { techHref } from './urls';

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
    // Tech 詳細は実績のある Tech にだけ作られる（hasRecords）。
    // プロフィールの Strengths のように、Engineering Graph の集計対象でない場所からも参照されるため確認する
    linkable: new Set([...graph.tech.values()].filter(hasRecords).map((n) => n.id)),
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
