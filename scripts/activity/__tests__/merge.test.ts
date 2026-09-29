import { describe, expect, it } from 'vitest';
import { mergeActivity } from '../merge';
import type { Activity } from '../types';

const activity = (id: string, date: string, summary = '生成した要約'): Activity => ({
  id,
  date,
  type: 'feature',
  work: 'w',
  headline: id,
  summary,
  tech: [],
  techSource: 'work',
  url: 'https://github.com/o/r/pull/1',
});

describe('mergeActivity', () => {
  it('既にある id は生成し直さず、手で直した内容を残す', () => {
    const existing = [activity('o/r#1', '2026-09-20', '手で直した要約')];
    const { activity: merged, added } = mergeActivity(
      existing,
      [activity('o/r#1', '2026-09-20')],
      new Set(),
    );
    expect(merged[0].summary).toBe('手で直した要約');
    expect(added).toEqual([]);
  });

  it('新しい id だけを追加し、新しい順に並べる', () => {
    const { activity: merged, added } = mergeActivity(
      [activity('o/r#1', '2026-09-20')],
      [activity('o/r#2', '2026-09-24'), activity('o/r#1', '2026-09-20')],
      new Set(),
    );
    expect(merged.map((a) => a.id)).toEqual(['o/r#2', 'o/r#1']);
    expect(added.map((a) => a.id)).toEqual(['o/r#2']);
  });

  it('除外リストの id は生成せず、既存からも取り除く', () => {
    const { activity: merged, added } = mergeActivity(
      [activity('o/r#1', '2026-09-20')],
      [activity('o/r#2', '2026-09-24')],
      new Set(['o/r#1', 'o/r#2']),
    );
    expect(merged).toEqual([]);
    expect(added).toEqual([]);
  });

  it('同じ日付では、今回追加したものを既存のものより前に置く', () => {
    const { activity: merged } = mergeActivity(
      [activity('o/r#1', '2026-09-24')],
      [activity('o/r#2', '2026-09-24')],
      new Set(),
    );
    expect(merged.map((a) => a.id)).toEqual(['o/r#2', 'o/r#1']);
  });
});
