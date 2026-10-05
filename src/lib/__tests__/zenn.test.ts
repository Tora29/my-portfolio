import { describe, expect, it } from 'vitest';
import {
  techIdsFromTopics,
  topicToTechId,
  zennArticleUrl,
  zennPublishedDate,
  zennSlugFromFile,
  zennTopicOf,
} from '../zenn';

describe('zennTopicOf', () => {
  it('Tech の id からハイフンを除いて Zenn の topic にする', () => {
    expect(zennTopicOf('claude-code')).toBe('claudecode');
    expect(zennTopicOf('typescript')).toBe('typescript');
  });
});

describe('topicToTechId', () => {
  it('ハイフンを除くと同じ topic になる Tech があればエラーにする', () => {
    expect(() => topicToTechId(['next-js', 'nextjs'])).toThrow('「next-js」と「nextjs」');
  });
});

describe('techIdsFromTopics', () => {
  const techIds = topicToTechId(['typescript', 'github-actions', 'claude-code']);

  it('Tech に対応する topics だけを、topics の順で Tech の id にする', () => {
    expect(techIdsFromTopics(['claudecode', '個人開発', 'typescript'], techIds)).toEqual([
      'claude-code',
      'typescript',
    ]);
  });

  it('大文字・小文字の違いを無視する', () => {
    expect(techIdsFromTopics(['GitHubActions'], techIds)).toEqual(['github-actions']);
  });

  it('同じ Tech を重ねない', () => {
    expect(techIdsFromTopics(['typescript', 'TypeScript'], techIds)).toEqual(['typescript']);
  });
});

describe('zennArticleUrl', () => {
  it('スラッグから Zenn の記事の URL を作る', () => {
    expect(zennArticleUrl('static-first-portfolio')).toBe(
      'https://zenn.dev/tora29/articles/static-first-portfolio',
    );
  });
});

describe('zennSlugFromFile', () => {
  it('ファイル名から拡張子を除いてスラッグにする', () => {
    expect(zennSlugFromFile('static-first-portfolio.md')).toBe('static-first-portfolio');
  });

  it('Zenn のスラッグの規則に合わなければエラーにする', () => {
    expect(() => zennSlugFromFile('short.md')).toThrow('12〜50字');
    expect(() => zennSlugFromFile('Static-First-Portfolio.md')).toThrow('12〜50字');
    expect(() => zennSlugFromFile(`${'a'.repeat(51)}.md`)).toThrow('12〜50字');
  });
});

describe('zennPublishedDate', () => {
  it('日付を、その日の UTC 0 時にする', () => {
    expect(zennPublishedDate('2026-09-28')?.toISOString()).toBe('2026-09-28T00:00:00.000Z');
  });

  it('時刻付きでも、実行環境のタイムゾーンによらず日付の部分を公開日にする', () => {
    // 日本時間の 0〜9時は UTC では前日だが、Zenn の時刻は日本時間なので日付はそのまま
    expect(zennPublishedDate('2026-01-01 08:00')?.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('書式が合わない・存在しない日付は undefined', () => {
    expect(zennPublishedDate('2026/09/28')).toBeUndefined();
    expect(zennPublishedDate('2026-09-28T08:00')).toBeUndefined();
    expect(zennPublishedDate('2026-02-30')).toBeUndefined();
  });
});
