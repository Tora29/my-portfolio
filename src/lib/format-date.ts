/**
 * 日付の表示
 *
 * 日付はタイムゾーンによるずれを避けるため、文字列（YYYY-MM-DD。日本時間の日付）のまま扱う。
 * Date に変換すると、ビルドするマシンのタイムゾーンで前日・翌日にずれることがあるため。
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 月と日だけの短い表示（例：2026-09-24 → Sep 24）。タイムラインなど、年が文脈から分かる場所で使う */
export function formatShortDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

/**
 * Date を YYYY-MM-DD にする（記事の date など、日付を UTC の 0 時の Date として持つ値）。
 * 実行環境のタイムゾーンに左右されないよう、UTC で取り出す（toISOString）
 */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
