/**
 * Tech 一覧・Tech 詳細に表示するデータの組み立て
 *
 * Engineering Graph（id の集計結果）に、作品名・記事タイトル・所属などの表示用の値を結び付ける。
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { getCollection } from 'astro:content';
import { groupByCategory, hasRecords } from '@/lib/graph/build-graph';
import { loadGraph, loadTechCategories } from '@/lib/graph/load-graph';
import type { ContentKind, Graph, TechNode } from '@/lib/graph/types';
import { toDateString } from '@/lib/format-date';
import { formatPeriod } from '@/lib/format-period';
import { newestCareerFirst, newestNoteFirst } from '@/lib/order';
import { techHref, workHref } from '@/lib/urls';
import { zennArticleUrl } from '@/lib/zenn';

/** Tech 一覧の関連コンテンツ名は1行で省略表示するため、それ以上は渡さない */
const LIST_RELATED_CONTENTS = 4;

export interface TechListItem {
  id: string;
  name: string;
  href: string;
  /** 実績のある下位 Tech の名前（「+ 下位の技術名」として添える） */
  childNames: string[];
  /** 下位 Tech を含めた種類別の件数 */
  counts: Record<ContentKind, number>;
  /** 関連するコンテンツ名（作品名・記事タイトル・所属） */
  relatedContents: string[];
}

export interface TechGenre {
  id: string;
  name: string;
  tech: TechListItem[];
}

export interface TechDetail {
  id: string;
  name: string;
  childNames: string[];
  works: { href: string; title: string; summary: string }[];
  notes: { href: string; title: string; date: string }[];
  career: { org: string; role: string; period: string }[];
  activity: { date: string; work: string; headline: string }[];
  related: { href: string; label: string }[];
}

/** 実績のある下位 Tech の名前。実績のない下位 Tech まで出すと「含む」の意味が薄れるため除く */
function childNamesOf(node: TechNode, graph: Graph): string[] {
  return node.children
    .map((id) => graph.tech.get(id)!)
    .filter(hasRecords)
    .map((child) => child.name);
}

/** コンテンツの id から表示用の値を引くための対応表 */
async function loadContentIndex() {
  const [works, notes, career, activity] = await Promise.all([
    getCollection('works'),
    getCollection('notes'),
    getCollection('career'),
    getCollection('activity'),
  ]);
  return {
    works: new Map(works.map((e) => [e.id, e])),
    notes: new Map(notes.map((e) => [e.id, e])),
    career: new Map(career.map((e) => [e.id, e])),
    activity: new Map(activity.map((e) => [e.id, e])),
  };
}

/** Tech 一覧：ジャンルごとに区切り、実績の多い順に並べる。Tech が1件もないジャンルは出さない */
export async function loadTechList(): Promise<TechGenre[]> {
  const [graph, categories, index] = await Promise.all([
    loadGraph(),
    loadTechCategories(),
    loadContentIndex(),
  ]);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  const toItem = (node: TechNode): TechListItem => ({
    id: node.id,
    name: node.name,
    href: techHref(node.id),
    childNames: childNamesOf(node, graph),
    counts: {
      works: node.total.works.length,
      notes: node.total.notes.length,
      career: node.total.career.length,
      activity: node.total.activity.length,
    },
    // Activity は件数が多く名前も作品名と重なるため、作品・記事・職歴の名前だけを並べる
    relatedContents: [
      ...node.total.works.map((id) => index.works.get(id)!.data.title),
      ...node.total.notes.map((id) => index.notes.get(id)!.data.title),
      ...node.total.career.map((id) => index.career.get(id)!.data.org),
    ].slice(0, LIST_RELATED_CONTENTS),
  });

  return groupByCategory(
    graph,
    categories.map((c) => c.id),
  )
    .map((group) => ({
      id: group.category,
      name: categoryName.get(group.category)!,
      tech: group.tech.filter(hasRecords).map(toItem),
    }))
    .filter((genre) => genre.tech.length > 0);
}

/** Tech 詳細：詳細ページを作るすべての Tech について、種類別の実績と関連 Tech を返す */
export async function loadTechDetails(): Promise<TechDetail[]> {
  const [graph, index] = await Promise.all([loadGraph(), loadContentIndex()]);

  const toDetail = (node: TechNode): TechDetail => ({
    id: node.id,
    name: node.name,
    childNames: childNamesOf(node, graph),
    works: node.total.works
      .map((id) => index.works.get(id)!)
      .toSorted((a, b) => a.data.title.localeCompare(b.data.title, 'ja'))
      .map((e) => ({ href: workHref(e.id), title: e.data.title, summary: e.data.summary })),
    // 記事・職歴・Activity は新しい順
    notes: node.total.notes
      .map((id) => index.notes.get(id)!)
      .toSorted(newestNoteFirst)
      .map((e) => ({
        href: zennArticleUrl(e.id),
        title: e.data.title,
        date: toDateString(e.data.date),
      })),
    career: node.total.career
      .map((id) => index.career.get(id)!)
      .toSorted(newestCareerFirst)
      .map((e) => ({ org: e.data.org, role: e.data.role, period: formatPeriod(e.data.period) })),
    activity: node.total.activity
      .map((id) => index.activity.get(id)!)
      .toSorted((a, b) => a.data.order - b.data.order)
      .map((e) => ({
        date: e.data.date,
        work: index.works.get(e.data.work.id)!.data.title,
        headline: e.data.headline,
      })),
    related: node.related.map((id) => ({ href: techHref(id), label: graph.tech.get(id)!.name })),
  });

  return [...graph.tech.values()].filter(hasRecords).map(toDetail);
}
