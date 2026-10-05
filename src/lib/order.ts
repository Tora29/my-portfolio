/**
 * 一覧の並び順
 *
 * 記事・職歴は、一覧のページと、作品詳細の Related Notes・Tech 詳細のように別の機能でも並べる。
 * 同じものがページによって違う順に並ばないよう、比べ方をここにまとめる。
 * getCollection は返す順を保証しないため、同順位でも必ず決まる順（タイトル・所属名）まで比べる
 * （ビルドごとに並びが変わらないように）。
 */

/** 記事を新しい順に。同じ日付の記事はタイトル順 */
export const newestNoteFirst = (
  a: { data: { date: Date; title: string } },
  b: { data: { date: Date; title: string } },
) =>
  b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title, 'ja');

/** 現職（end: null）は、どの終了年よりも新しいものとして扱う */
const endOf = (end: number | null) => end ?? Number.MAX_SAFE_INTEGER;

/**
 * 職歴を新しい順に。開始年が同じなら終了年の新しいほう（現職を最新とする）、それも同じなら所属名順。
 * 現職どうしを Infinity で引くと NaN になるため、終了年は有限の値に置き換えて比べる
 */
export const newestCareerFirst = (
  a: { data: { period: { start: number; end: number | null }; org: string } },
  b: { data: { period: { start: number; end: number | null }; org: string } },
) =>
  b.data.period.start - a.data.period.start ||
  endOf(b.data.period.end) - endOf(a.data.period.end) ||
  a.data.org.localeCompare(b.data.org, 'ja');
