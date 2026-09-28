/**
 * 作品一覧・作品詳細に表示するデータの組み立て（.users/requirements/screens.md §5.3・§5.4）
 *
 * 作品（content/works）に、その作品の Activity・関連する記事・Tech タグを結び付ける。
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import type { ImageMetadata } from 'astro';
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { ACTIVITY_ICONS, activityHref } from '@/lib/activity';
import type { IconName } from '@/components/ui/Icon.astro';
import { formatShortDate, toDateString } from '@/lib/format-date';
import { loadTechTags } from '@/lib/load-tech-tags';
import type { TechTagList } from '@/lib/tech-tags';

type Work = CollectionEntry<'works'>;
type Activity = CollectionEntry<'activity'>;

const STATUS_LABELS: Record<Work['data']['status'], string> = {
  developing: '開発中',
  active: '運用中',
  archived: 'アーカイブ',
};

export const workHref = (id: string) => `/works/${id}`;

export interface WorkListItem {
  id: string;
  href: string;
  title: string;
  summary: string;
  cover?: { src: ImageMetadata; alt: string };
  tags: TechTagList;
  /** 最新の Activity。まだなければ undefined（表示しない） */
  latest?: { date: string; label: string; headline: string; href: string };
}

export interface TimelineItem {
  date: string;
  label: string;
  icon: IconName;
  headline: string;
  summary: string;
}

export interface RelatedNote {
  href: string;
  title: string;
  date: string;
  /** 関連する理由（「この作品について書いた記事」「共通の技術：…」） */
  reason: string;
}

export interface WorkDetail extends WorkListItem {
  status: string;
  github?: { label: string; href: string };
  /** 本文（MDX。Overview / Architecture） */
  Content: Awaited<ReturnType<typeof render>>['Content'];
  /** その作品の Activity（新しい順） */
  timeline: TimelineItem[];
  activityHref: string;
  relatedNotes: RelatedNote[];
}

/** 作品ごとの Activity（新しい順。activity.json の並び） */
async function loadActivityByWork(): Promise<Map<string, Activity[]>> {
  const activity = await getCollection('activity');
  const byWork = new Map<string, Activity[]>();
  for (const entry of activity.toSorted((a, b) => a.data.order - b.data.order)) {
    const list = byWork.get(entry.data.work.id) ?? [];
    list.push(entry);
    byWork.set(entry.data.work.id, list);
  }
  return byWork;
}

/**
 * 作品の並び順。最近 Activity があった作品を先にし、Activity がない作品はタイトル順で後ろに並べる。
 * 手で順番を管理しなくても、いま開発している作品が上に来るようにするため
 */
function compareWorks(latestDate: (work: Work) => string | undefined) {
  return (a: Work, b: Work) => {
    const [da, db] = [latestDate(a), latestDate(b)];
    if (da !== db) {
      if (da === undefined) return 1;
      if (db === undefined) return -1;
      return db.localeCompare(da);
    }
    return a.data.title.localeCompare(b.data.title, 'ja');
  };
}

async function toListItem(work: Work, activity: Activity[]): Promise<WorkListItem> {
  const latest = activity[0];
  return {
    id: work.id,
    href: workHref(work.id),
    title: work.data.title,
    summary: work.data.summary,
    // スキーマで cover があれば coverAlt もあることを確認済み
    cover: work.data.cover && { src: work.data.cover, alt: work.data.coverAlt! },
    tags: await loadTechTags(work.data.tech),
    latest: latest && {
      date: latest.data.date,
      label: formatShortDate(latest.data.date),
      headline: latest.data.headline,
      href: activityHref(work.id),
    },
  };
}

/** 作品一覧：すべての作品を、最近 Activity があった順に返す */
export async function loadWorksList(): Promise<WorkListItem[]> {
  const [works, activityByWork] = await Promise.all([getCollection('works'), loadActivityByWork()]);
  const sorted = works.toSorted(
    compareWorks((work) => activityByWork.get(work.id)?.[0]?.data.date),
  );
  return Promise.all(sorted.map((work) => toListItem(work, activityByWork.get(work.id) ?? [])));
}

/**
 * 作品に関連する記事。
 * 1. 記事の works で明示的に関連付けられたもの（この作品について書いた記事）
 * 2. 作品と共通の Tech を持つもの（理由として共通の Tech を添える）
 * それぞれ新しい順に並べ、1 を先に出す（明示的な関連のほうが確かなため）
 */
function relatedNotesOf(
  work: Work,
  notes: CollectionEntry<'notes'>[],
  techName: (id: string) => string,
): RelatedNote[] {
  const workTech = new Set(work.data.tech.map((ref) => ref.id));
  const toItem = (note: CollectionEntry<'notes'>, reason: string): RelatedNote => ({
    href: `/notes/${note.id}`,
    title: note.data.title,
    date: toDateString(note.data.date),
    reason,
  });
  const byDate = notes.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // 1.
  const explicit = byDate.filter((note) => note.data.works.some((ref) => ref.id === work.id));
  // 2.
  const byTech = byDate
    .filter((note) => !explicit.includes(note))
    .map((note) => ({ note, common: note.data.tags.filter((ref) => workTech.has(ref.id)) }))
    .filter(({ common }) => common.length > 0);

  return [
    ...explicit.map((note) => toItem(note, 'この作品について書いた記事')),
    ...byTech.map(({ note, common }) =>
      toItem(note, `共通の技術：${common.map((ref) => techName(ref.id)).join(' · ')}`),
    ),
  ];
}

/** 作品詳細：すべての作品について、本文・Development Timeline・関連する記事を返す */
export async function loadWorkDetails(): Promise<WorkDetail[]> {
  const [works, notes, tech, activityByWork] = await Promise.all([
    getCollection('works'),
    getCollection('notes'),
    getCollection('tech'),
    loadActivityByWork(),
  ]);
  const techNames = new Map(tech.map((e) => [e.id, e.data.name]));

  return Promise.all(
    works.map(async (work) => {
      const activity = activityByWork.get(work.id) ?? [];
      const { github } = work.data;
      return {
        ...(await toListItem(work, activity)),
        status: STATUS_LABELS[work.data.status],
        github: github && {
          label: `${github.owner}/${github.repo}`,
          href: `https://github.com/${github.owner}/${github.repo}`,
        },
        Content: (await render(work)).Content,
        timeline: activity.map((entry) => ({
          date: entry.data.date,
          label: formatShortDate(entry.data.date),
          icon: ACTIVITY_ICONS[entry.data.type],
          headline: entry.data.headline,
          summary: entry.data.summary,
        })),
        activityHref: activityHref(work.id),
        relatedNotes: relatedNotesOf(work, notes, (id) => techNames.get(id)!),
      };
    }),
  );
}
