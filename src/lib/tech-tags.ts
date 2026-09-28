/**
 * Tech タグの列の組み立て（.users/requirements/screens.md §3.7）
 *
 * コンテンツに付けられた Tech の id を、表示名・リンク先を持つタグに変える。
 * 7個以上あるときは先頭6個だけを常に表示し、残りは「+N」で展開する。
 * 展開後はジャンル別にまとめて全件を表示するため、そのグループもここで作る。
 *
 * このファイルは Astro に依存しない純粋な関数だけを置く（単体テストの対象）。
 * Content Collections からの読み込みは load-tech-tags.ts が行う。
 */

/** 常に表示するタグの数。これを超えると「+N」にまとめる */
export const VISIBLE_TAGS = 6;

export interface TechTag {
  id: string;
  label: string;
  /** Tech 詳細のURL。詳細ページがない Tech（実績0件）は undefined（リンクにしない） */
  href?: string;
}

export interface TechTagList {
  /** 付けられた順のすべてのタグ */
  tags: TechTag[];
  /** 常に表示するタグ（先頭 VISIBLE_TAGS 個） */
  visible: TechTag[];
  /** 「+N」の N。0 なら展開の操作を出さない */
  hiddenCount: number;
  /** 展開したときのジャンル別の全件。ジャンルの表示順（tech-categories.yml の順）に並ぶ */
  groups: { name: string; tags: TechTag[] }[];
}

export interface TechTagSource {
  /** Tech の id → 表示名とジャンルの id */
  tech: Map<string, { name: string; category: string }>;
  /** ジャンルを表示順に並べたもの */
  categories: { id: string; name: string }[];
  /** 詳細ページがある Tech の id */
  linkable: Set<string>;
  /** Tech 詳細のURL */
  hrefOf: (id: string) => string;
}

/**
 * Tech の id の並びからタグの列を作る。
 * 並び順は書かれた順のまま（重要なものから書く運用のため）。未定義の id はスキーマで弾かれている前提
 */
export function buildTechTags(ids: string[], source: TechTagSource): TechTagList {
  const tags = ids.map((id) => ({
    id,
    label: source.tech.get(id)!.name,
    href: source.linkable.has(id) ? source.hrefOf(id) : undefined,
  }));

  // ちょうど7個のとき「+1」で1個だけ隠すより全部見せたほうが早いが、
  // 画面要件（7個以上は先頭6個と +N）に揃え、一覧の行の高さを揃えることを優先する
  const overflow = tags.length > VISIBLE_TAGS;

  // グループ内はタグの並び（書かれた順）を保つ
  const groups = overflow
    ? source.categories
        .map((category) => ({
          name: category.name,
          tags: tags.filter((tag) => source.tech.get(tag.id)!.category === category.id),
        }))
        .filter((group) => group.tags.length > 0)
    : [];

  return {
    tags,
    visible: overflow ? tags.slice(0, VISIBLE_TAGS) : tags,
    hiddenCount: overflow ? tags.length - VISIBLE_TAGS : 0,
    groups,
  };
}
