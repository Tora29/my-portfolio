/**
 * PR・Release から Activity への変換（.users/design/activity-pipeline.md §4）
 *
 * タイトルの解析・種類の判定・要約・Tech・日付を組み合わせて1件の Activity にする。
 * GitHub API は呼ばない（取得は github.ts、呼び出しの順序は main.ts）。
 */
import { classifyPullRequest } from './classify.ts';
import { parseTitle } from './parse-title.ts';
import { extractSummary } from './summary.ts';
import { assignTech } from './tech.ts';
import type { Activity, PullRequest, Release, Target } from './types.ts';

/** 変換の結果。載せないものは理由を、Tech ラベルの誤りは警告を返す */
export type ConvertResult =
  { activity: Activity; warnings: string[] } | { skip: string; warnings: string[] };

/**
 * 日時（ISO 8601）を日本時間の日付にする。
 * 閲覧者も開発者も日本時間で活動しているため、UTC の日付だと朝9時前のマージが前日扱いになってしまう
 */
export function toJstDate(iso: string): string {
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  return new Date(new Date(iso).getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * PR を Activity にする。
 * 載せない PR（マージされていない・雑務の種類・activity:skip など。classify.ts）は理由を返す。
 * tech.yml にない Tech のラベルは無視し、警告として返す（ラベルの書き誤りでワークフローを止めないため）
 */
export function convertPullRequest(
  pr: PullRequest,
  target: Target,
  knownTech: Set<string>,
): ConvertResult {
  const { type: prefix, headline } = parseTitle(pr.title);
  const classification = classifyPullRequest(pr, prefix);
  if ('skip' in classification) return { skip: classification.skip, warnings: [] };

  const id = `${target.owner}/${target.repo}#${pr.number}`;
  const { tech, techSource, unknown } = assignTech(pr.labels, target.tech, knownTech);
  return {
    activity: {
      id,
      date: toJstDate(pr.mergedAt!),
      type: classification.type,
      work: target.work,
      headline,
      summary: extractSummary(pr.body, headline),
      tech,
      techSource,
      url: pr.url,
    },
    warnings: unknown.map((t) => `${id}: tech.yml にない Tech のラベル（tech:${t}）を無視しました`),
  };
}

/** Release を Activity にする。下書き・プレリリース・公開日のないものは載せない */
export function convertRelease(release: Release, target: Target): ConvertResult {
  if (release.draft || release.prerelease || release.publishedAt === null) {
    return { skip: '下書き・プレリリース', warnings: [] };
  }
  const headline = `${release.tagName} をリリース`;
  return {
    activity: {
      id: `${target.owner}/${target.repo}@${release.tagName}`,
      date: toJstDate(release.publishedAt),
      type: 'release',
      work: target.work,
      headline,
      summary: extractSummary(release.body, headline),
      // Release はラベルを持たないため、作品の Tech を引き継ぐ
      tech: target.tech,
      techSource: 'work',
      url: release.url,
    },
    warnings: [],
  };
}
