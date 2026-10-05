import { describe, expect, it } from 'vitest';
import { newestCareerFirst, newestNoteFirst } from '../order';

describe('newestNoteFirst', () => {
  const note = (date: string, title: string) => ({ data: { date: new Date(date), title } });

  it('新しい順に並べ、同じ日付はタイトル順にする', () => {
    const sorted = [
      note('2026-09-28', 'b'),
      note('2026-09-29', 'z'),
      note('2026-09-28', 'a'),
    ].toSorted(newestNoteFirst);
    expect(sorted.map((n) => n.data.title)).toEqual(['z', 'a', 'b']);
  });
});

describe('newestCareerFirst', () => {
  const career = (start: number, end: number | null, org: string) => ({
    data: { period: { start, end }, org },
  });

  it('開始年の新しい順。同じなら終了年の新しい順で、現職を最新とする', () => {
    const sorted = [
      career(2021, 2023, 'a'),
      career(2023, 2024, 'b'),
      career(2023, null, 'c'),
    ].toSorted(newestCareerFirst);
    expect(sorted.map((c) => c.data.org)).toEqual(['c', 'b', 'a']);
  });

  it('開始年・終了年が同じ（現職どうしを含む）なら所属名順にする', () => {
    const sorted = [career(2024, null, 'b'), career(2024, null, 'a')].toSorted(newestCareerFirst);
    expect(sorted.map((c) => c.data.org)).toEqual(['a', 'b']);
  });
});
