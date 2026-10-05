/**
 * 経験年数の計算（About の見出しで使う。読み込みは load-profile.ts の loadExperience）
 *
 * 職歴の期間は年単位でしか持たない（公開範囲のルール。screens.md §6）ため、
 * 最も古い職歴の開始年から現在の年までの差を「約 N 年」として表示する。
 */

/**
 * 経験年数。最も古い職歴の開始年から currentYear までの年数を返す。
 * 職歴が1件もなければ 0。職歴の間に空白期間があっても差し引かない（年単位では空白を表せないため）
 */
export function yearsOfExperience(periods: { start: number }[], currentYear: number): number {
  if (periods.length === 0) return 0;
  const first = Math.min(...periods.map((p) => p.start));
  return Math.max(0, currentYear - first);
}

/** 経験年数の表示（例：約5年）。1年未満は「1年未満」とする */
export function formatExperience(years: number): string {
  return years < 1 ? '1年未満' : `約${years}年`;
}
