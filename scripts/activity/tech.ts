/**
 * Activity への Tech の付与（.users/design/engineering-graph.md §4.2）
 *
 * PR の tech:<id> ラベルがあればそれを使い、なければ作品の Tech を引き継ぐ。
 * ラベルは PR ごとに付ける手間がかかるため、付いていないのが普通という前提で作品の Tech を既定にする。
 */
import type { Activity } from './types.ts';

const LABEL_PREFIX = 'tech:';

export interface TechAssignment {
  tech: string[];
  techSource: Activity['techSource'];
  /** tech.yml にない id のラベル（無視して警告を出す） */
  unknown: string[];
}

/**
 * @param labels PR のラベル名
 * @param workTech 作品の Tech
 * @param knownTech tech.yml に定義された id
 */
export function assignTech(
  labels: string[],
  workTech: string[],
  knownTech: Set<string>,
): TechAssignment {
  const ids = labels
    .filter((label) => label.startsWith(LABEL_PREFIX))
    .map((label) => label.slice(LABEL_PREFIX.length).trim());
  // 未定義の id をそのまま出力するとビルドが失敗し、他の Activity まで公開できなくなるため、無視する
  const known = [...new Set(ids.filter((id) => knownTech.has(id)))];
  const unknown = ids.filter((id) => !knownTech.has(id));

  // 有効なラベルが1つもなければ、ラベルがない場合と同じく作品の Tech を使う
  return known.length > 0
    ? { tech: known, techSource: 'label', unknown }
    : { tech: workTech, techSource: 'work', unknown };
}
