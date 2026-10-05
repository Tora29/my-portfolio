/**
 * 更新からの経過日数による表示の判定（.users/requirements/screens.md §4.2・§4.3）
 *
 * Home の右下の最新 Activity と、惑星の「最近の更新」の印に使う。
 * 閲覧した日によって結果が変わるため、ブラウザ側で呼ぶ（ビルド時の判定は、JavaScript が無効なときの表示にだけ使う）。
 */

/** 更新から today までの日数。日付は YYYY-MM-DD（日本時間の日付）として扱う */
export function daysSince(date: string, today: Date): number {
  const [y, m, d] = date.split('-').map(Number);
  // today も日本時間の日付に揃えて、日単位の差を取る（閲覧者の時刻で日付がずれないように）
  const jst = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  const todayUtc = Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate());
  return Math.round((todayUtc - Date.UTC(y, m - 1, d)) / 86_400_000);
}

/** 「最近の更新」とみなす日数。最新 Activity の live と、惑星のラベルの点で同じ基準を使う */
export const FRESH_DAYS = 7;

/**
 * 最新 Activity の表示の状態。
 * - live：7日以内。緑の点が脈動し「Latest」
 * - recent：30日以内。緑の点（静止）・「Latest」
 * - stale：それより前。灰色の点・「Last update」（更新が止まっているのに動いているように見せないため）
 */
export type Freshness = 'live' | 'recent' | 'stale';

/** 更新からの日数に応じた表示の状態 */
export function freshnessOf(days: number): Freshness {
  if (days <= FRESH_DAYS) return 'live';
  if (days <= 30) return 'recent';
  return 'stale';
}
