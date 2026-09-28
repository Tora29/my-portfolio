/**
 * PR タイトルの解析（Conventional Commits。.users/design/activity-pipeline.md §4.1）
 *
 * `feat(works): Tech をジャンル別に表示` → type: feat / scope: works / headline: Tech をジャンル別に表示
 */

export interface ParsedTitle {
  /** 接頭辞がなければ undefined */
  type?: string;
  scope?: string;
  headline: string;
}

// type(scope)!: 本文。scope と破壊的変更の ! は省略できる
const PATTERN = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?!?:\s*(?<headline>.+)$/;

/** タイトルを解析する。接頭辞がない場合は、タイトル全体を見出しにする */
export function parseTitle(title: string): ParsedTitle {
  const trimmed = title.trim();
  const match = PATTERN.exec(trimmed);
  if (!match?.groups) return { headline: trimmed };
  const { type, scope, headline } = match.groups;
  return { type, scope, headline: headline.trim() };
}
