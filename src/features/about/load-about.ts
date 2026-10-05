/**
 * About の表示用データの組み立て（.users/requirements/screens.md §5.1）
 *
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import type { IconName } from '@/lib/icons';
import { groupByDate } from '@/lib/activity';
import { loadActivityItems, type ActivityItem } from '@/lib/load-activity';
import { loadExperience, loadProfile } from '@/lib/load-profile';
import { loadTechTags } from '@/lib/load-tech-tags';
import type { TechTagList } from '@/lib/tech-tags';

/** Latest Activity の件数（screens.md §3.6） */
const LATEST_ACTIVITY = 3;

export interface AboutPage {
  name: string;
  /** 職種・現在の役割・経験年数（例：Web Engineer · Tech Lead · 約5年） */
  headline: string[];
  intro: string;
  strengths: TechTagList;
  values: string[];
  next: string;
  links: { label: string; href: string; icon: IconName }[];
  /** 最新の Activity（日付ごと）。まだなければ空（見出しごと表示しない） */
  latestActivity: { date: string; items: ActivityItem[] }[];
}

/** 外部リンクのアイコン。サービスが分かるものはそのロゴ、それ以外は外部リンクの矢印 */
const linkIcon = (href: string): IconName =>
  new URL(href).hostname === 'github.com' ? 'github-logo' : 'arrow-up-right';

/** About に表示するデータを読み込む（ビルド時） */
export async function loadAboutPage(): Promise<AboutPage> {
  const [profile, experience, activity] = await Promise.all([
    loadProfile(),
    loadExperience(),
    loadActivityItems(),
  ]);

  return {
    name: profile.name,
    headline: [profile.role, profile.current, experience],
    intro: profile.intro,
    strengths: await loadTechTags(profile.strengths),
    values: profile.values,
    next: profile.next,
    links: profile.links.map((link) => ({ ...link, icon: linkIcon(link.href) })),
    latestActivity: groupByDate(activity.slice(0, LATEST_ACTIVITY)),
  };
}
