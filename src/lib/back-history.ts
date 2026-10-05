/**
 * 戻るボタンの戻り先の判定（.users/requirements/screens.md §3.4）
 *
 * 本文中のリンクでサイト内を移動するたびに「どこから（from）どこへ（to）」を積み、
 * 移動先のページで「直前のページ」を決める。タブ・Prev / Next での移動は積まずに履歴を消す。
 *
 * ブラウザの戻る・進むや URL の直接入力では記録が更新されないため、ページを開くたびに
 * 記録と現在の URL を照らし合わせ、食い違っていれば記録を捨てて「所属する一覧へ戻る」に切り替える。
 *
 * このファイルは DOM・sessionStorage に依存しない純粋な関数だけを置く（単体テストの対象）。
 * 保存と画面への反映は components/ui/BackButton.astro のスクリプトが行う。
 */

export interface BackEntry {
  /** 移動元のURL（パス＋クエリ） */
  from: string;
  /** 移動元のページ名（戻るボタンのラベル） */
  label: string;
  /** 移動先のURL（パス＋クエリ） */
  to: string;
}

/**
 * sessionStorage から読んだ値を、記録の配列として使える形にする。
 * 同じサイトのスクリプトしか書かない値だが、形の違う古い値・手で書き換えた値で戻るボタンの処理が止まらないよう、
 * 配列でなければ空、形の合わない記録は取り除く
 */
export function parseBackStack(value: unknown): BackEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is BackEntry =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof entry.from === 'string' &&
      typeof entry.label === 'string' &&
      typeof entry.to === 'string',
  );
}

/** 積む上限。行き来を繰り返しても sessionStorage が膨らみ続けないようにする */
const MAX_ENTRIES = 30;

/** 本文のリンクで移動するとき：移動元を積む */
export function pushEntry(stack: BackEntry[], entry: BackEntry): BackEntry[] {
  return [...stack, entry].slice(-MAX_ENTRIES);
}

/**
 * ページを開いたとき：記録を現在のURLに合わせ、戻り先を返す。
 *
 * 1. 先頭が「現在のページから出ていった記録」なら取り除く
 *    （ブラウザの戻るで戻ってきた場合。戻るボタンで戻った場合は押した時点で取り除いてある）
 * 2. 先頭が「現在のページへ来た記録」なら、その移動元が戻り先
 * 3. どちらでもなければ記録は古い（直接開いた・ブラウザの進む等）ため、すべて捨てる
 */
export function resolveBack(
  stack: BackEntry[],
  current: string,
): { stack: BackEntry[]; back?: BackEntry } {
  const rest = [...stack];
  // 1. 同じページを複数回経由した場合に備え、該当するものが続く限り取り除く
  while (rest.length > 0 && rest.at(-1)!.from === current) rest.pop();

  // 2.
  const top = rest.at(-1);
  if (top && top.to === current) return { stack: rest, back: top };

  // 3.
  return { stack: [] };
}

/** 戻るボタンを押したとき：先頭を取り除く（戻った先で、さらにその前へ戻れるように） */
export function popEntry(stack: BackEntry[]): BackEntry[] {
  return stack.slice(0, -1);
}
