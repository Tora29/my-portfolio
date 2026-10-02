import { describe, expect, it } from 'vitest';
import { techIdsFromTopics, zennArticleUrl, zennSlugFromFile, zennTopicOf } from '../zenn';

describe('zennTopicOf', () => {
  it('Tech の id からハイフンを除いて Zenn の topic にする', () => {
    expect(zennTopicOf('claude-code')).toBe('claudecode');
    expect(zennTopicOf('typescript')).toBe('typescript');
  });
});

describe('techIdsFromTopics', () => {
  const techIds = ['typescript', 'github-actions', 'claude-code'];

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
