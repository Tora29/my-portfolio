/**
 * Activity の種類と除外の判定（.users/design/activity-pipeline.md §4.2）
 *
 * 閲覧者（採用担当・エンジニア）にとって意味のある変更だけを載せる。
 * 依存関係の更新・CI の調整などの雑務は、件数が多く中身が伝わらないため除外する。
 */
import type { ActivityType, PullRequest } from './types.ts';

/** 確認用 PR のブランチ。このワークフロー自身が作る PR は Activity にしない */
export const BOT_BRANCH = 'bot/activity';

/** Activity に載せない PR に付けるラベル */
export const SKIP_LABEL = 'activity:skip';

const TYPES: Record<string, ActivityType | null> = {
  feat: 'feature',
  fix: 'fix',
  perf: 'improvement',
  refactor: 'improvement',
  docs: 'docs',
  // 雑務は除外する
  chore: null,
  ci: null,
  build: null,
  test: null,
  style: null,
};

export type Classification = { type: ActivityType } | { skip: string };

/**
 * PR の種類を判定する。載せない場合は理由を返す（ログに出し、除外が意図どおりか確かめられるように）
 *
 * @param prefix PR タイトルの接頭辞（parseTitle の type）
 */
export function classifyPullRequest(pr: PullRequest, prefix: string | undefined): Classification {
  if (pr.mergedAt === null) return { skip: 'マージされていない' };
  if (pr.byBot) return { skip: 'Bot が作成した' };
  if (pr.headRef === BOT_BRANCH) return { skip: '確認用 PR' };
  if (pr.labels.includes(SKIP_LABEL)) return { skip: `${SKIP_LABEL} ラベル` };

  // 接頭辞がない PR も載せる（規約に沿っていなくても、変更自体は活動の記録になるため）
  if (prefix === undefined) return { type: 'pr' };
  const type = TYPES[prefix];
  if (type === null) return { skip: `${prefix} は載せない種類` };
  // 未知の接頭辞（typo など）は、接頭辞なしと同じ扱いにする
  return { type: type ?? 'pr' };
}
