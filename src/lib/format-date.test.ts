import { describe, expect, it } from 'vitest';
import { formatShortDate, toDateString } from './format-date';

describe('formatShortDate', () => {
  it('月を英語の略称にし、日の先頭の0を除く', () => {
    expect(formatShortDate('2026-09-04')).toBe('Sep 4');
    expect(formatShortDate('2026-12-31')).toBe('Dec 31');
  });
});

describe('toDateString', () => {
  it('YAML の日付（UTC の 0 時）をその日の日付にする', () => {
    expect(toDateString(new Date('2026-08-22'))).toBe('2026-08-22');
  });
});
