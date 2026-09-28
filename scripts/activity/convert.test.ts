import { describe, expect, it } from 'vitest';
import { convertPullRequest, convertRelease, toJstDate } from './convert';
import type { PullRequest, Release, Target } from './types';

// GitHub API のレスポンスを変換した後の形（fixture）
const target: Target = {
  owner: 'Tora29',
  repo: 'my-portfolio',
  work: 'personal-platform',
  tech: ['typescript'],
};
const known = new Set(['typescript', 'astro']);

const pr: PullRequest = {
  number: 12,
  title: 'feat(works): 作品一覧を追加',
  body: '作品を一覧できるようにした。\n\n## 変更内容\n- …',
  mergedAt: '2026-09-23T16:30:00Z',
  labels: ['tech:astro'],
  byBot: false,
  headRef: 'feat/works',
  url: 'https://github.com/Tora29/my-portfolio/pull/12',
};

describe('toJstDate', () => {
  it('日本時間の日付にする（UTC で前日の夜は、日本時間では翌日）', () => {
    expect(toJstDate('2026-09-23T16:30:00Z')).toBe('2026-09-24');
    expect(toJstDate('2026-09-23T14:59:59Z')).toBe('2026-09-23');
  });
});

describe('convertPullRequest', () => {
  it('PR を Activity に変換する', () => {
    expect(convertPullRequest(pr, target, known)).toEqual({
      activity: {
        id: 'Tora29/my-portfolio#12',
        date: '2026-09-24',
        type: 'feature',
        work: 'personal-platform',
        headline: '作品一覧を追加',
        summary: '作品を一覧できるようにした。',
        tech: ['astro'],
        techSource: 'label',
        url: 'https://github.com/Tora29/my-portfolio/pull/12',
      },
      warnings: [],
    });
  });

  it('載せない PR は理由を返す', () => {
    expect(
      convertPullRequest({ ...pr, title: 'chore: 依存関係を更新' }, target, known),
    ).toHaveProperty('skip');
  });

  it('未定義の Tech のラベルは警告を返す', () => {
    const result = convertPullRequest({ ...pr, labels: ['tech:nope'] }, target, known);
    expect(result.warnings).toHaveLength(1);
  });
});

describe('convertRelease', () => {
  const release: Release = {
    tagName: 'v1.0.0',
    body: null,
    publishedAt: '2026-09-24T03:00:00Z',
    draft: false,
    prerelease: false,
    url: 'https://github.com/Tora29/my-portfolio/releases/tag/v1.0.0',
  };

  it('リリースノートがなければ「{tag} をリリース」を要約にする', () => {
    const result = convertRelease(release, target);
    expect(result).toMatchObject({
      activity: { id: 'Tora29/my-portfolio@v1.0.0', type: 'release', summary: 'v1.0.0 をリリース' },
    });
  });

  it('下書き・プレリリースは載せない', () => {
    expect(convertRelease({ ...release, draft: true }, target)).toHaveProperty('skip');
    expect(convertRelease({ ...release, prerelease: true }, target)).toHaveProperty('skip');
  });
});
