import { describe, expect, it } from 'vitest';
import { daysSince, freshnessOf } from '../freshness';

describe('daysSince', () => {
  it('日本時間の日付で差を数える', () => {
    // 日本時間 2026-09-25 08:00（UTC では前日の 23:00）
    const today = new Date('2026-09-24T23:00:00Z');
    expect(daysSince('2026-09-25', today)).toBe(0);
    expect(daysSince('2026-09-18', today)).toBe(7);
  });
});

describe('freshnessOf', () => {
  it('7日以内・30日以内・それより前で表示を切り替える', () => {
    expect(freshnessOf(0)).toBe('live');
    expect(freshnessOf(7)).toBe('live');
    expect(freshnessOf(8)).toBe('recent');
    expect(freshnessOf(30)).toBe('recent');
    expect(freshnessOf(31)).toBe('stale');
  });
});
