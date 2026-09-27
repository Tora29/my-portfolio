/**
 * Engineering Graph の型
 */

/** Tech を付けられるコンテンツの種類。Tech 詳細での表示順でもある */
export const CONTENT_KINDS = ['works', 'notes', 'career', 'activity'] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

/** 種類ごとのコンテンツ id の一覧 */
export type ContentIds = Record<ContentKind, string[]>;

/** 集計に渡す Tech（data/tech.yml の1件） */
export interface TechInput {
  id: string;
  name: string;
  /** ジャンルの id（data/tech-categories.yml） */
  category: string;
  /** 上位 Tech の id */
  parent?: string;
}

/** 集計に渡すコンテンツ。種類ごとに異なるフィールド名（Notes の tags など）は揃えてから渡す */
export interface ContentInput {
  kind: ContentKind;
  id: string;
  tech: string[];
}

export interface GraphInput {
  /** tech.yml の記述順に並べて渡す（同数時の並び順に使う） */
  tech: TechInput[];
  contents: ContentInput[];
}

/** 1つの Tech の集計結果 */
export interface TechNode {
  id: string;
  name: string;
  category: string;
  parent?: string;
  /** 直下の下位 Tech の id（tech.yml の順） */
  children: string[];
  /** その Tech が直接付与されたコンテンツ */
  direct: ContentIds;
  /** 下位 Tech の実績を含めたコンテンツ。同一コンテンツは1件として数える */
  total: ContentIds;
  /** 同じコンテンツで併用された Tech（回数の多い順、最大10件）。自身・上位・下位は除く */
  related: string[];
}

export interface Graph {
  /** Tech の id → 集計結果。tech.yml の記述順に並ぶ */
  tech: Map<string, TechNode>;
  /** どのコンテンツからも直接参照されない Tech の id */
  unused: string[];
}
