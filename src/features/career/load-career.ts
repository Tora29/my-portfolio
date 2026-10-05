/**
 * 職歴と資格の表示用データの組み立て（.users/requirements/screens.md §5.2）
 *
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { getCollection } from 'astro:content';
import { formatPeriod } from '@/lib/format-period';
import { loadProfile } from '@/lib/load-profile';
import { loadTechTags } from '@/lib/load-tech-tags';
import { newestCareerFirst } from '@/lib/order';
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

/** Career に表示するデータを読み込む（ビルド時）。職歴は新しい順 */
export async function loadCareerPage(): Promise<CareerPage> {
  const [career, profile] = await Promise.all([getCollection('career'), loadProfile()]);
  const sorted = career.toSorted(newestCareerFirst);

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
