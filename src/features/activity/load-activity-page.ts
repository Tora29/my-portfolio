/**
 * Activity 一覧の表示用データの組み立て（.users/requirements/screens.md §5.9）
 *
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { activityHref, groupByDate, initialCount } from '@/lib/activity';
import { loadActivityItems, type ActivityItem } from '@/lib/load-activity';

/** 初期表示の件数（screens.md §3.6） */
export const ACTIVITY_LIMIT = 20;

export interface ActivityPage {
  /** 絞り込みの選択肢（All の次に並べる作品）。Activity のある作品だけを、最近 Activity があった順に並べる */
  filters: { workId: string; label: string; href: string }[];
  groups: { date: string; items: ActivityItem[] }[];
  /** 絞り込まないときに初期表示する日付のまとまりの数（JavaScript で畳む前の目印に使う） */
  initialGroups: number;
  total: number;
}

export async function loadActivityPage(): Promise<ActivityPage> {
  const items = await loadActivityItems();

  // items は新しい順なので、初めて現れた順が「最近 Activity があった順」になる
  const filters = new Map<string, ActivityPage['filters'][number]>();
  for (const item of items) {
    if (!filters.has(item.work.id)) {
      filters.set(item.work.id, {
        workId: item.work.id,
        label: item.work.title,
        href: activityHref(item.work.id),
      });
    }
  }

  return {
    filters: [...filters.values()],
    groups: groupByDate(items),
    initialGroups: groupByDate(items.slice(0, initialCount(items, ACTIVITY_LIMIT))).length,
    total: items.length,
  };
}
