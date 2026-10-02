/**
 * Home の表示用データの組み立て（.users/requirements/screens.md §4）
 *
 * 惑星（Career / Works / Tech / Notes）の衛星の数・更新の印、左下の職種と GitHub、右下の最新 Activity。
 * 「7日以内」などの経過日数による表示の切り替えは、閲覧した日によって変わるため、
 * ここでは日付だけを渡し、判定はブラウザ側（HomeScene.astro のスクリプト）で行う。
 */
import { getCollection } from 'astro:content';
import { totalCount } from '@/lib/graph/build-graph';
import { loadGraph } from '@/lib/graph/load-graph';
import { formatShortDate, toDateString } from '@/lib/format-date';
import { loadActivityItems } from '@/lib/load-activity';
import { findLink, loadProfile } from '@/lib/load-profile';
import { SECTIONS, type SectionId } from '@/lib/sections';

/** Tech の衛星の上限。技術の数は多く、すべてを衛星にすると惑星が埋もれるため */
const TECH_MOON_LIMIT = 5;

export type PlanetId = Extract<SectionId, 'career' | 'works' | 'tech' | 'notes'>;

/** 公転の順（90°間隔。screens.md §4.2） */
export const PLANET_IDS: PlanetId[] = ['career', 'works', 'tech', 'notes'];

export interface Planet {
  id: PlanetId;
  title: string;
  href: string;
  color: string;
  /** 衛星の数（そのセクションの件数） */
  moons: number;
  /** 最後に更新された日（YYYY-MM-DD）。「7日以内の更新」の印に使う。更新の印を出さない惑星は undefined */
  updated?: string;
}

export interface HomePage {
  name: string;
  role: string;
  github?: string;
  planets: Planet[];
  /** 最新の Activity。まだなければ undefined（右下に何も出さない） */
  latest?: { date: string; label: string; text: string };
}

export async function loadHomePage(): Promise<HomePage> {
  const [profile, works, notes, career, graph, activity] = await Promise.all([
    loadProfile(),
    getCollection('works'),
    getCollection('notes'),
    getCollection('career'),
    loadGraph(),
    loadActivityItems(),
  ]);

  const latestNote = notes
    .map((note) => toDateString(note.data.date))
    .toSorted()
    .at(-1);
  const visibleTech = [...graph.tech.values()].filter((node) => totalCount(node) > 0).length;

  // 更新の印は、作品は Activity、記事は投稿日で判定する。
  // 職歴と Tech は日々更新されるものではないため、印を出さない（モックと同じ）
  const moons: Record<PlanetId, number> = {
    career: career.length + profile.certifications.length,
    works: works.length,
    tech: Math.min(visibleTech, TECH_MOON_LIMIT),
    notes: notes.length,
  };
  const updated: Partial<Record<PlanetId, string>> = {
    works: activity[0]?.date,
    notes: latestNote,
  };

  const latest = activity[0];
  return {
    name: profile.name,
    role: profile.role,
    github: findLink(profile.links, 'github.com'),
    planets: PLANET_IDS.map((id) => ({
      id,
      title: SECTIONS[id].title,
      href: SECTIONS[id].href,
      color: SECTIONS[id].color,
      moons: moons[id],
      updated: updated[id],
    })),
    latest: latest && {
      date: latest.date,
      label: formatShortDate(latest.date),
      text: `${latest.work.title} — ${latest.headline}`,
    },
  };
}
