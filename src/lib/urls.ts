/**
 * 詳細ページの URL
 *
 * 作品・Tech の詳細ページへのリンクは、一覧・詳細・Activity・Tech タグなど複数の機能から張る。
 * URL の形を変えたときに一部だけ古いまま残らないよう、ここだけで組み立てる（ページは src/pages/works/[id].astro・tech/[id].astro）。
 */

/** 作品詳細の URL */
export const workHref = (id: string) => `/works/${id}`;

/** Tech 詳細の URL */
export const techHref = (id: string) => `/tech/${id}`;
