/**
 * Activity（data/activity.json）の表示用データの組み立て
 *
 * About の Latest Activity と Activity 一覧で共通に使う。
 * ビルド時（ページの生成時）にのみ呼ぶ。ブラウザ向けのスクリプトから import しない。
 */
import { getCollection } from 'astro:content';
import type { IconName } from '@/lib/icons';
import { ACTIVITY_ICONS } from './activity';
import { loadTechTags } from './load-tech-tags';
import type { TechTagList } from './tech-tags';
import { workHref } from './urls';

export interface ActivityItem {
  id: string;
  /** 日本時間の日付（YYYY-MM-DD） */
  date: string;
  icon: IconName;
  work: { id: string; title: string; href: string };
  headline: string;
  summary: string;
  tags: TechTagList;
}

/** すべての Activity を新しい順（activity.json の並び）に返す */
export async function loadActivityItems(): Promise<ActivityItem[]> {
  const [activity, works] = await Promise.all([getCollection('activity'), getCollection('works')]);
  const workTitle = new Map(works.map((e) => [e.id, e.data.title]));

  return Promise.all(
    activity
      .toSorted((a, b) => a.data.order - b.data.order)
      .map(async (e) => ({
        id: e.id,
        date: e.data.date,
        icon: ACTIVITY_ICONS[e.data.type],
        work: {
          id: e.data.work.id,
          title: workTitle.get(e.data.work.id)!,
          href: workHref(e.data.work.id),
        },
        headline: e.data.headline,
        summary: e.data.summary,
        tags: await loadTechTags(e.data.tech),
      })),
  );
}
