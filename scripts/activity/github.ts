/**
 * GitHub API からのマージ済み PR・Release の取得（.users/design/activity-pipeline.md §3.2・§3.3）
 *
 * 認証は GitHub Actions 標準の GITHUB_TOKEN（公開 Repository の読み取りのみに使う）。
 * トークンがなくても公開 Repository は読めるため、手元での確認では省略できる（ただし回数制限が厳しい）。
 *
 * レスポンスは使う項目だけをスキーマで検証する（API の変更で想定外の値が activity.json に入らないように）。
 */
import { z } from 'astro/zod';
import type { PullRequest, Release } from './types.ts';

const API = 'https://api.github.com';
const PER_PAGE = 100;

const pullSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  merged_at: z.string().nullable(),
  labels: z.array(z.object({ name: z.string() })),
  user: z.object({ type: z.string() }).nullable(),
  head: z.object({ ref: z.string() }),
  html_url: z.url(),
});

const releaseSchema = z.object({
  tag_name: z.string(),
  body: z.string().nullable(),
  published_at: z.string().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  html_url: z.url(),
});

/**
 * 一覧 API を最後のページまで取得する。
 * MVP では毎回全件を取得し直す（件数が少ないうちは、前回の取得位置を管理するより単純で確実なため）
 */
async function fetchAll<T extends z.ZodType>(path: string, schema: T): Promise<z.infer<T>[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const items: z.infer<T>[] = [];
  for (let page = 1; ; page++) {
    const separator = path.includes('?') ? '&' : '?';
    const url = `${API}${path}${separator}per_page=${PER_PAGE}&page=${page}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API の取得に失敗しました（${response.status}）：${url}`);
    }
    const data = z.array(schema).parse(await response.json());
    items.push(...data);
    if (data.length < PER_PAGE) return items;
  }
}

/** マージ済み・クローズ済みの PR（マージされていないものは classify.ts で除外する） */
export async function fetchPullRequests(owner: string, repo: string): Promise<PullRequest[]> {
  const pulls = await fetchAll(`/repos/${owner}/${repo}/pulls?state=closed`, pullSchema);
  return pulls.map((pr) => ({
    number: pr.number,
    title: pr.title,
    body: pr.body,
    mergedAt: pr.merged_at,
    labels: pr.labels.map((label) => label.name),
    byBot: pr.user?.type === 'Bot',
    headRef: pr.head.ref,
    url: pr.html_url,
  }));
}

/** Release の一覧（下書き・プレリリースも含む。載せるかは convert.ts で判定する） */
export async function fetchReleases(owner: string, repo: string): Promise<Release[]> {
  const releases = await fetchAll(`/repos/${owner}/${repo}/releases`, releaseSchema);
  return releases.map((release) => ({
    tagName: release.tag_name,
    body: release.body,
    publishedAt: release.published_at,
    draft: release.draft,
    prerelease: release.prerelease,
    url: release.html_url,
  }));
}
