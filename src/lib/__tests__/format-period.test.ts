import { describe, expect, it } from 'vitest';
import { formatPeriod } from '../format-period';

describe('formatPeriod', () => {
  it('開始年と終了年をダッシュでつなぐ', () => {
    expect(formatPeriod({ start: 2021, end: 2023 })).toBe('2021 — 2023');
  });

  it('現職（end が null）は Present と表示する', () => {
    expect(formatPeriod({ start: 2024, end: null })).toBe('2024 — Present');
  });
});
