/**
 * Activity の表示に使う値（Works・About・Activity で共通）
 */
import type { CollectionEntry } from 'astro:content';
import type { IconName } from '@/lib/icons';

export type ActivityType = CollectionEntry<'activity'>['data']['type'];

/**
 * 種類のアイコン。PR 由来（機能追加・修正・改善・ドキュメント）はすべて PR のアイコンにし、
 * 違いは見出しで伝える（アイコンの種類を増やすと、見分けるための凡例が必要になるため）
 */
export const ACTIVITY_ICONS: Record<ActivityType, IconName> = {
  feature: 'git-pull-request',
  fix: 'git-pull-request',
  improvement: 'git-pull-request',
  docs: 'git-pull-request',
  pr: 'git-pull-request',
  release: 'tag',
};

/** Activity を作品で絞り込んだ一覧の URL */
export const activityHref = (workId?: string) =>
  workId ? `/activity?work=${encodeURIComponent(workId)}` : '/activity';

/**
 * 日付ごとにまとめる。items は新しい順に並んでいる前提で、日付の並びもその順を保つ
 */
export function groupByDate<T extends { date: string }>(
  items: T[],
): { date: string; items: T[] }[] {
  const groups: { date: string; items: T[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && last.date === item.date) last.items.push(item);
    else groups.push({ date: item.date, items: [item] });
  }
  return groups;
}

/**
 * 初期表示の件数。limit 件で区切るが、同じ日付の途中では区切らず、その日の最後まで含める
 * （screens.md §3.6。1日の活動が「もっと見る」の前後に分かれると、同じ日付の見出しが2回出るため）
 */
export function initialCount(items: { date: string }[], limit: number): number {
  let count = Math.min(limit, items.length);
  while (count > 0 && count < items.length && items[count].date === items[count - 1].date) count++;
  return count;
}
