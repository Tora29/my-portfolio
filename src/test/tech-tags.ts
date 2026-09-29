/**
 * テスト用の Tech タグの列（TechTagList）
 *
 * 組み立ては lib/tech-tags.ts の buildTechTags に任せる（コンポーネントのテストで並びの規則を持ち直さないため）。
 * Tech の id をそのまま表示名にし、すべてリンクにする
 */
import { buildTechTags, type TechTagList } from '@/lib/tech-tags';

export function techTags(...ids: string[]): TechTagList {
  return buildTechTags(ids, {
    tech: new Map(ids.map((id) => [id, { name: id, category: 'lang' }])),
    categories: [{ id: 'lang', name: 'Language' }],
    linkable: new Set(ids),
    hrefOf: (id) => `/tech/${id}`,
  });
}
