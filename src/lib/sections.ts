/**
 * セクション（About / Career / Works / Tech / Notes / Activity）の定義
 *
 * タブ・見出し・Prev / Next・アクセント色など、セクションをまたいで使う情報を1か所にまとめる。
 * 並び順はタブの順（.users/requirements/screens.md §3.2）。
 */
import type { IconName } from '@/components/ui/Icon.astro';

export const SECTION_IDS = ['about', 'career', 'works', 'tech', 'notes', 'activity'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface Section {
  id: SectionId;
  /** タブ・見出しに出す名前（英字。見出しでは大文字で表示する） */
  title: string;
  href: string;
  icon: IconName;
  /** 一覧ページの見出しの下に出す説明 */
  lead: string;
  /**
   * アクセント色。global.css の @theme で定義した色を参照する。
   * SectionLayout がこの値を --accent に設定し、セクション内の部品は --accent だけを見る
   */
  color: string;
}

export const SECTIONS: Record<SectionId, Section> = {
  about: {
    id: 'about',
    title: 'About',
    href: '/about',
    icon: 'user-circle',
    lead: '',
    color: 'var(--color-about)',
  },
  career: {
    id: 'career',
    title: 'Career',
    href: '/career',
    icon: 'path',
    lead: '経験してきたこと。職歴と役割、資格。',
    color: 'var(--color-career)',
  },
  works: {
    id: 'works',
    title: 'Works',
    href: '/works',
    icon: 'code',
    lead: '作ったもの。完成物だけでなく、設計と開発の過程まで。',
    color: 'var(--color-works)',
  },
  tech: {
    id: 'tech',
    title: 'Tech',
    href: '/tech',
    icon: 'cpu',
    lead: '使ってきた技術と、その根拠。自己申告ではなく実績から。',
    color: 'var(--color-tech)',
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    href: '/notes',
    icon: 'notebook',
    lead: '書いたこと。技術記事、メモ、読書記録、失敗と振り返り。',
    color: 'var(--color-notes)',
  },
  activity: {
    id: 'activity',
    title: 'Activity',
    href: '/activity',
    icon: 'pulse',
    lead: 'GitHub上の公開された開発活動から生成しています。',
    color: 'var(--color-activity)',
  },
};

/** タブ順で前後のセクション。端のセクションでは片方が undefined になる */
export function adjacentSections(id: SectionId): { prev?: Section; next?: Section } {
  const index = SECTION_IDS.indexOf(id);
  const at = (i: number) =>
    i >= 0 && i < SECTION_IDS.length ? SECTIONS[SECTION_IDS[i]] : undefined;
  return { prev: at(index - 1), next: at(index + 1) };
}
