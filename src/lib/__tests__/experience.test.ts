import { describe, expect, it } from 'vitest';
import { formatExperience, yearsOfExperience } from '../experience';

describe('yearsOfExperience', () => {
  it('最も古い職歴の開始年から数える（並び順に依存しない）', () => {
    const periods = [{ start: 2024 }, { start: 2021 }, { start: 2023 }];
    expect(yearsOfExperience(periods, 2026)).toBe(5);
  });

  it('職歴がなければ 0', () => {
    expect(yearsOfExperience([], 2026)).toBe(0);
  });

  it('開始年が未来でも負の値にしない', () => {
    expect(yearsOfExperience([{ start: 2027 }], 2026)).toBe(0);
  });
});

describe('formatExperience', () => {
  it('約 N 年と表示する', () => {
    expect(formatExperience(5)).toBe('約5年');
  });

  it('1年未満はそのように表示する', () => {
    expect(formatExperience(0)).toBe('1年未満');
  });
});
