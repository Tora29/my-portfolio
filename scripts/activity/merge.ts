/**
 * 既存の Activity・除外リストとの統合（.users/design/activity-pipeline.md §5.2）
 *
 * 確認用 PR で人が直した要約や削除が、翌日の再生成で元に戻らないようにする。
 * - 既に activity.json にある id は、生成し直さずに既存の内容をそのまま残す
 * - 除外リストにある id は生成しない（activity.json から消すだけでは翌日にまた追加されるため）
 */
import type { Activity } from './types.ts';

export interface MergeResult {
  /** 統合後の全件（新しい順） */
  activity: Activity[];
  /** 今回新しく追加したもの（確認用 PR の本文に載せる） */
  added: Activity[];
}

/**
 * @param existing 現在の activity.json
 * @param generated 今回 GitHub から生成したもの
 * @param excluded 除外リストの id
 */
export function mergeActivity(
  existing: Activity[],
  generated: Activity[],
  excluded: Set<string>,
): MergeResult {
  const known = new Set(existing.map((a) => a.id));
  const added = generated.filter((a) => !known.has(a.id) && !excluded.has(a.id));

  // 除外リストに後から追加された id は、既存の activity.json に残っていても載せない
  const kept = existing.filter((a) => !excluded.has(a.id));

  // 新しい順。同じ日付の中は、今回追加したものを先にする（既存のものより後に起きた活動のため）。
  // toSorted は安定ソートなので、同じ日付の中の並びは元の順を保つ
  const activity = [...added, ...kept].toSorted((a, b) => b.date.localeCompare(a.date));
  return { activity, added };
}
