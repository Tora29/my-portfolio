/**
 * Activity の表示に使う値（Works・About・Activity で共通）
 */
import type { CollectionEntry } from 'astro:content';
import type { IconName } from '@/components/ui/Icon.astro';

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
