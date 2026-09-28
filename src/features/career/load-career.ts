/**
 * 職歴と資格の表示用データの組み立て（.users/requirements/screens.md §5.2）
 *
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { getCollection } from 'astro:content';
import { formatPeriod } from '@/lib/format-period';
import { loadProfile } from '@/lib/load-profile';
import { loadTechTags } from '@/lib/load-tech-tags';
import type { TechTagList } from '@/lib/tech-tags';

export interface CareerItem {
  period: string;
  org: string;
  role: string;
  summary: string;
  tags: TechTagList;
}

export interface CareerPage {
  /** 新しい順 */
  career: CareerItem[];
  certifications: string[];
  extraCertifications: string[];
}

export async function loadCareerPage(): Promise<CareerPage> {
  const [career, profile] = await Promise.all([getCollection('career'), loadProfile()]);
  // 開始年が同じ場合は、終了年の新しいほう（現職の end: null を最新とする）を先にする
  const endOf = (end: number | null) => end ?? Infinity;
  const sorted = career.toSorted(
    (a, b) =>
      b.data.period.start - a.data.period.start ||
      endOf(b.data.period.end) - endOf(a.data.period.end),
  );

  return {
    career: await Promise.all(
      sorted.map(async (e) => ({
        period: formatPeriod(e.data.period),
        org: e.data.org,
        role: e.data.role,
        summary: e.data.summary,
        tags: await loadTechTags(e.data.tech),
      })),
    ),
    certifications: profile.certifications,
    extraCertifications: profile.extraCertifications,
  };
}
