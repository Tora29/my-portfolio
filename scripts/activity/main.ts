/**
 * GitHub Activity の取得・生成（npm run activity）
 *
 * 通常は GitHub Actions（.github/workflows/activity.yml）から毎日実行する。
 * 1. 許可リスト（github を持つ作品）を作る
 * 2. 各 Repository のマージ済み PR・Release を取得する
 * 3. Activity に変換する（載せないものは除外）
 * 4. 既存の activity.json・除外リストと統合し、新しい分だけを追加して書き出す
 *
 * --summary <file> を指定すると、公開前の Activity の一覧を Markdown で書き出す（確認用 PR の本文に使う）。
 * 公開前かどうかは --base <file>（main の activity.json）と比べて決める。確認用 PR は毎日上書きされるため、
 * 今回の実行で追加した分だけでなく、まだ main にない分をすべて載せる
 * --dry-run を指定すると、activity.json を書き換えずに追加分を表示する（手元での確認用。
 * activity.json は確認用 PR 上でしか変更しないため）
 *
 * 設計：.users/design/activity-pipeline.md
 */
import { writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { convertPullRequest, convertRelease, type ConvertResult } from './convert.ts';
import { loadActivity, loadExcluded, loadKnownTech, loadTargets, saveActivity } from './files.ts';
import { fetchPullRequests, fetchReleases } from './github.ts';
import { mergeActivity } from './merge.ts';
import { renderSummary } from './report.ts';
import type { Activity } from './types.ts';

const { values } = parseArgs({
  options: {
    summary: { type: 'string' },
    base: { type: 'string' },
    'dry-run': { type: 'boolean' },
  },
});

// 1.
const [targets, knownTech, excluded, existing] = await Promise.all([
  loadTargets(),
  loadKnownTech(),
  loadExcluded(),
  loadActivity(),
]);

const generated: { activity: Activity; at: string }[] = [];
for (const target of targets) {
  const name = `${target.owner}/${target.repo}`;
  // 2.
  const [pulls, releases] = await Promise.all([
    fetchPullRequests(target.owner, target.repo),
    fetchReleases(target.owner, target.repo),
  ]);

  // 3. 除外の理由と警告はログに出し、Actions の実行結果から確かめられるようにする
  const collect = (label: string, at: string | null, result: ConvertResult) => {
    for (const warning of result.warnings) console.warn(`::warning::${warning}`);
    if ('skip' in result) console.log(`  - 除外 ${label}：${result.skip}`);
    else generated.push({ activity: result.activity, at: at! });
  };
  console.log(`${name}：PR ${pulls.length} 件・Release ${releases.length} 件`);
  for (const pr of pulls)
    collect(`#${pr.number}`, pr.mergedAt, convertPullRequest(pr, target, knownTech));
  for (const release of releases) {
    collect(`@${release.tagName}`, release.publishedAt, convertRelease(release, target));
  }
}

// 4. 同じ日付の中でも新しい順になるよう、日時で並べてから統合する
const { activity, added } = mergeActivity(
  existing,
  generated.toSorted((a, b) => b.at.localeCompare(a.at)).map((g) => g.activity),
  excluded,
);
console.log(`追加 ${added.length} 件（合計 ${activity.length} 件）`);
if (values['dry-run']) console.log(JSON.stringify(added, null, 2));
else await saveActivity(activity);

if (values.summary) {
  const published = new Set(values.base ? (await loadActivity(values.base)).map((a) => a.id) : []);
  await writeFile(values.summary, renderSummary(activity.filter((a) => !published.has(a.id))));
}
