import { describe, expect, it } from 'vitest';
import { parseTitle } from './parse-title';

describe('parseTitle', () => {
  it('type・scope・見出しに分ける', () => {
    expect(parseTitle('feat(works): Tech をジャンル別に表示')).toEqual({
      type: 'feat',
      scope: 'works',
      headline: 'Tech をジャンル別に表示',
    });
  });

  it('scope と破壊的変更の ! は省略できる', () => {
    expect(parseTitle('fix: 表示の崩れを修正')).toEqual({
      type: 'fix',
      scope: undefined,
      headline: '表示の崩れを修正',
    });
    expect(parseTitle('feat(api)!: 応答の形式を変更').headline).toBe('応答の形式を変更');
  });

  it('接頭辞がなければタイトル全体を見出しにする', () => {
    expect(parseTitle('  トップページを追加 ')).toEqual({ headline: 'トップページを追加' });
  });

  it('見出しの中のコロンは見出しに残す', () => {
    expect(parseTitle('docs: 用語：Tech の定義を追記').headline).toBe('用語：Tech の定義を追記');
  });
});
